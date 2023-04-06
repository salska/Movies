import io.vertx.core.AbstractVerticle;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.mysqlclient.MySQLConnectOptions;
import io.vertx.ext.web.*;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.mysqlclient.MySQLPool;
import io.vertx.sqlclient.*;

import java.util.HashMap;
import java.util.Map;

class AppServer extends AbstractVerticle {
    public AppServer() {
    }

    public static Map<String, JsonObject> movies = new HashMap<>();
    public static MySQLConnectOptions connectOptions = null;
    public static PoolOptions poolOptions = null;
    public static MySQLPool pool = null;

    @Override
    public void start() {
        connectOptions = new MySQLConnectOptions()
                .setPort(3306)
                .setHost("laguna")
                .setDatabase("Movies")
                .setUser("root")
                .setPassword("c200sport");

        poolOptions = new PoolOptions()
                .setMaxSize(5);

        pool = MySQLPool.pool(vertx, connectOptions, poolOptions);

        HttpServer server = vertx.createHttpServer();

        Router router = Router.router(vertx);
        router.route().handler(BodyHandler.create());
        router.get("/refresh").handler(this::handleRefreshMovies);
        router.get("/movies/:id").handler(this::handleGetMovie);
        router.get("/movies").handler(this::handleListMovies);
        router.post("/movies").handler(this::handleAddMovie);
        router.put("/movies/:id").handler(this::handleUpdateMovie);
        router.delete("/movies/:id").handler(this::handleDeleteMovie);

        server.requestHandler(router).listen(8046, http -> {
            if (http.succeeded()) {
                System.out.println("Movies server started on port 8046");
            } else {
                System.out.println("Movies server failed to start");
            }
        });
    }

    private void handleGetMovie(RoutingContext routingContext) {
        String ID = routingContext.request().getParam("id");
        HttpServerResponse response = routingContext.response();
        if (ID == null) {
            sendError(400, response);
        } else {
            JsonObject movie = movies.get(ID);
            if (movie == null) {
                sendError(404, response);
            } else {
                response.putHeader("content-type", "application/json").end(movie.encodePrettily());
            }
        }
    }

    private void handleAddMovie(RoutingContext routingContext) {
        JsonObject movie = null;
        String imdbID = "tt" + new java.util.Date();
        HttpServerResponse response = routingContext.response();
        if (response == null) {
            sendError(400, response);
        } else {
            movie = routingContext.getBodyAsJson();
            if (movie == null) {
                sendError(400, response);
            } else {
                pool.preparedQuery("INSERT INTO Movie (imdbID,Title,imdbRating,Plot,Director,Runtime,ReleaseDate,Genre) VALUES (?,?,?,?,?,?,?,?)")
                        .execute(Tuple.of(imdbID,
                                movie.getValue("title"),
                                movie.getValue("rating"),
                                movie.getValue("plot"),
                                movie.getValue("director"),
                                movie.getValue("runtime"),
                                movie.getValue("release"),
                                movie.getValue("genre")), ar -> {
                            if (ar.succeeded()) {
                                RowSet<Row> rows = ar.result();
                                System.out.println(rows.rowCount());
                            } else {
                                System.out.println("Failure: " + ar.cause().getMessage());
                            }
                        });
            }
        }
    }

    private void handleUpdateMovie(RoutingContext routingContext) {
        String ID = routingContext.request().getParam("id");
        HttpServerResponse response = routingContext.response();
        if (response == null) {
            sendError(400, response);
        } else {
            JsonObject movie = routingContext.getBodyAsJson();
            if (movie == null) {
                sendError(400, response);
            } else {
                pool.preparedQuery("UPDATE Movie SET Title = ?, imdbRating = ?, Plot = ?, Director = ?, Runtime = ?, ReleaseDate = ?, Genre = ? WHERE ID = ?")
                        .execute(Tuple.of(movie.getValue("title"),
                                movie.getValue("rating"),
                                movie.getValue("plot"),
                                movie.getValue("director"),
                                movie.getValue("runtime"),
                                movie.getValue("release"),
                                movie.getValue("genre"),
                                ID), ar -> {
                            if (ar.succeeded()) {
                                RowSet<Row> rows = ar.result();
                                System.out.println(rows.rowCount());
                            } else {
                                System.out.println("Failure: " + ar.cause().getMessage());
                            }
                        });
            }
        }
    }

    private void handleDeleteMovie(RoutingContext routingContext) {
        JsonObject movie = null;
        String ID = routingContext.request().getParam("id");
        HttpServerResponse response = routingContext.response();
        if (response == null) {
            sendError(400, response);
        } else {
            movie = routingContext.getBodyAsJson();
            if (movie == null) {
                sendError(400, response);
            } else {
                pool.preparedQuery("DELETE FROM Movie WHERE ID = ?")
                        .execute(Tuple.of(ID), ar -> {
                            if (ar.succeeded()) {
                                RowSet<Row> rows = ar.result();
                                System.out.println(rows.rowCount());
                                handleRefreshMovies(routingContext);
                            } else {
                                System.out.println("Failure: " + ar.cause().getMessage());
                            }
                        });
            }
        }
    }

    private void handleListMovies(RoutingContext routingContext) {

        JsonArray arr = new JsonArray();

        pool.query("select * from Movie order by Movie.title")
                .execute().onSuccess(rows -> {
            for (Row row : rows) {
                addMovie(new JsonObject()
                        .put("id", row.getValue(0))
                        .put("title", row.getValue(1))
                        .put("imdbid", row.getValue(2))
                        .put("release", row.getValue(3))
                        .put("runtime", row.getValue(4))
                        .put("genre", row.getValue(5))
                        .put("director", row.getValue(6))
                        .put("plot", row.getValue(7))
                        .put("rating", ((String) row.getValue(8)).replaceAll("^\"|\"$", ""))
                );
                System.out.println("row = " + row.toJson());
            }
        }).onFailure(Throwable::printStackTrace);
        movies.forEach((k, v) -> arr.add(v));
        routingContext.response().putHeader("content-type", "application/json").end(arr.encodePrettily());
    }


    private void handleRefreshMovies(RoutingContext routingContext) {

        movies.clear();
        handleListMovies(routingContext);
    }

    private void sendError(int statusCode, HttpServerResponse response) {
        response.setStatusCode(statusCode).end();
    }

    private void addMovie(JsonObject movie) {
        movies.put(movie.getString("id"), movie);
    }

}
