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

    public static Map<String, JsonObject> awards = new HashMap<>();
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
        router.get("/awards/:id").handler(this::handleGetAwards);

        server.requestHandler(router).listen(8047, http -> {
            if (http.succeeded()) {
                System.out.println("Awards server started on port 8047");
            } else {
                System.out.println("Awards server failed to start");
            }
        });
    }

   private void handleGetAwards(RoutingContext routingContext) {
        String ID = routingContext.request().getParam("id");
        JsonArray arr = new JsonArray();
        awards.clear();

        pool.query("select * from Movie inner join AwardHistory on Movie.ID = AwardHistory.FK_MovieID inner join Award on Award.ID = AwardHistory.FK_AwardID where Movie.ID = " + ID)
                .execute(ar -> {
                    if (ar.succeeded()) {
                        RowSet<Row> rows = ar.result();
                        for (Row row : rows) {
                            addAward(new JsonObject()
                                    .put("id", row.getValue(9))
                                    .put("award", row.getValue(14))
                                    .put("event", row.getValue(15))
                                    .put("category", row.getValue(16))
                            );
                            System.out.println("row = " + row.toJson());
                        }
                        awards.forEach((k, v) -> arr.add(v));
                        routingContext.response().putHeader("content-type", "application/json").end(arr.encodePrettily());
                    } else {
                        System.out.println("Failure: " + ar.cause().getMessage());
                    }
                });
    }

    private void addAward(JsonObject award) {
        awards.put(award.getString("id"), award);
    }

}
