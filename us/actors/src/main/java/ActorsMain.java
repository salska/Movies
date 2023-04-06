import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.mysqlclient.MySQLConnectOptions;
import io.vertx.sqlclient.Pool;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.sqlclient.Row;
import io.vertx.sqlclient.SqlConnectOptions;

import java.util.HashMap;
import java.util.Map;

public class ActorsMain {

    // Convenience method so you can run it in your IDE
    public static void main(String[] args) {
        DeploymentOptions options = new DeploymentOptions().setWorker(true);
        Vertx vertx = Vertx.vertx();
        vertx.deployVerticle(new AppServer(), options);
    }

}