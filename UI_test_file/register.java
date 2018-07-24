package selenium;

import java.net.UnknownHostException;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.mongodb.DB;
import com.mongodb.Mongo;

public class register
{
    static Mongo mongo = null;
    static DB db = null;

    public static void initialize() throws UnknownHostException
    {
        mongo = new Mongo("ec2-52-204-117-72.compute-1.amazonaws.com", 27017);
        db = mongo.getDB("FSE");
        db.dropDatabase();
        System.out.println("DB reset!");
    }

    public static void main(String[] args) throws InterruptedException, UnknownHostException
    {
        initialize();
        String path = "C:\\Users\\32842\\OneDrive\\jar\\selenium\\geckodriver.exe";
        System.setProperty("webdriver.gecko.driver", path);
        
        WebDriver driver = new FirefoxDriver();
        Thread.sleep(2000);
        driver.get("http://localhost:3000");
        Thread.sleep(500);
        driver.findElement(By.cssSelector("button.waves-effect:nth-child(1)")).click();
        driver.findElement(By.id("firstname")).clear();
        driver.findElement(By.id("firstname")).sendKeys("testui");
        Thread.sleep(2000);
        driver.findElement(By.id("password")).clear();
        driver.findElement(By.id("password")).sendKeys("1234");
        Thread.sleep(2000);
        driver.findElement(By.id("email")).clear();
        driver.findElement(By.id("email")).sendKeys("1234@hotmail.com");
        Thread.sleep(2000);
        driver.findElement(By.cssSelector("button.waves-effect:nth-child(1)")).click();

    }
}
