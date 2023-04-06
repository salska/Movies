import io.vertx.core.AbstractVerticle;
import io.vertx.core.http.HttpServer;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.mysqlclient.MySQLConnectOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.mysqlclient.MySQLPool;
import io.vertx.sqlclient.*;

import java.util.HashMap;
import java.util.Map;

class AppServer extends AbstractVerticle {
    public AppServer() {
    }

    public static Map<String, JsonObject> actors = new HashMap<>();
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
        router.get("/actors/:id").handler(this::handleGetActors);

        server.requestHandler(router).listen(8048, http -> {
            if (http.succeeded()) {
                System.out.println("Actors server started on port 8048");
            } else {
                System.out.println("Actors server failed to start");
            }
        });
    }

    private void handleGetActors(RoutingContext routingContext) {
        String ID = routingContext.request().getParam("id");
        JsonArray arr = new JsonArray();
        actors.clear();
        pool.query("select * from Actor inner join Casting on Actor.ID = Casting.FK_ActorID inner join Movie on Movie.ID = Casting.FK_MovieID where Movie.ID = " + ID)
                .execute(ar -> {
                    if (ar.succeeded()) {
                        RowSet<Row> rows = ar.result();
                        for (Row row : rows) {
                            addActor(new JsonObject()
                                    .put("id", row.getValue(0))
                                    .put("name", row.getValue(1))
                            );
                            System.out.println("row = " + row.toJson());
                        }
                        actors.forEach((k, v) -> arr.add(v));
                        routingContext.response().putHeader("content-type", "application/json").end(arr.encodePrettily());
                    } else {
                        System.out.println("Failure: " + ar.cause().getMessage());
                    }
                });
    }

    private void addActor(JsonObject actor) {
        actors.put(actor.getString("id"), actor);
    }
}
