package selenium;

import java.net.UnknownHostException;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.Mongo;

public class Admin
{
    static Mongo mongo=null;
    static DB db=null;
    public static void initialize() throws UnknownHostException
    {
        mongo = new Mongo("ec2-52-204-117-72.compute-1.amazonaws.com", 27017);
        db = mongo.getDB("FSE");
        db.dropDatabase();
        BasicDBObject doc = new BasicDBObject("username", "ESNAdmin").append("password", "admin")
                .append("privilege_level", "Administrator");
        db.getCollection("users").insert(doc); 
        doc = new BasicDBObject("username", "ESN").append("password", "1234");
        db.getCollection("users").insert(doc); 
        System.out.println("DB reset!");
        
    }
    public static void main(String[] args) throws UnknownHostException, InterruptedException
    {
        // TODO Auto-generated method stub
        initialize();
        String path = "C:\\Users\\32842\\OneDrive\\jar\\selenium\\geckodriver.exe";
        System.setProperty("webdriver.gecko.driver", path);
        
        WebDriver driver = new FirefoxDriver();
        WebDriver driver2 = new FirefoxDriver();
        driver.get("https://emergency-social-network.herokuapp.com/");
        Thread.sleep(2000);
        driver2.get("https://emergency-social-network.herokuapp.com/");
//        driver.get("http://localhost:3000");
        driver.findElement(By.id("firstname")).clear();
        driver.findElement(By.id("firstname")).sendKeys("ESNAdmin");

        Thread.sleep(1000);
        driver.findElement(By.id("password")).clear();
        driver.findElement(By.id("password")).sendKeys("admin");

        Thread.sleep(1000);
        driver.findElement(By.cssSelector("button.waves-effect:nth-child(1)")).click();
        Thread.sleep(1000);
        driver.findElement(By.linkText("Directory")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//tr[2]/td[3]/button")).click();
        

        driver2.findElement(By.id("firstname")).clear();
        driver2.findElement(By.id("firstname")).sendKeys("ESN");

        Thread.sleep(1000);
        driver2.findElement(By.id("password")).clear();
        driver2.findElement(By.id("password")).sendKeys("1234");

        Thread.sleep(1000);
        driver2.findElement(By.cssSelector("button.waves-effect:nth-child(1)")).click();
        Thread.sleep(1000);
        driver2.findElement(By.linkText("Announcements")).click();
        driver.findElement(By.cssSelector("select.form-control:nth-child(2)")).sendKeys("Inactive");
        Thread.sleep(3000);
        driver.findElement(By.cssSelector("button.btn:nth-child(2)")).click();
        Thread.sleep(1000);
        System.out.println(driver2.getCurrentUrl().equals("https://emergency-social-network.herokuapp.com/#/"));
        driver2.findElement(By.id("firstname")).clear();
        driver2.findElement(By.id("firstname")).sendKeys("ESN");

        Thread.sleep(1000);
        driver2.findElement(By.id("password")).clear();
        driver2.findElement(By.id("password")).sendKeys("1234");
        driver2.findElement(By.cssSelector("button.waves-effect:nth-child(1)")).click();
        Thread.sleep(1000);
        System.out.println(driver2.getPageSource().contains("Your account is inactive."));
        driver.findElement(By.xpath("//tr[2]/td[3]/button")).click();
        Thread.sleep(1000);
        driver.findElement(By.cssSelector("input.form-control:nth-child(6)")).clear();
        driver.findElement(By.cssSelector("input.form-control:nth-child(6)")).sendKeys("ES");

        driver.findElement(By.cssSelector("button.btn:nth-child(2)")).click();
        System.out.println(driver.getPageSource().contains("Invalid username"));
        Thread.sleep(1000);
        driver.findElement(By.cssSelector("input.form-control:nth-child(6)")).sendKeys("ES");
        driver.findElement(By.cssSelector("input.form-control:nth-child(9)")).clear();
        Thread.sleep(1000);
        driver.findElement(By.cssSelector("input.form-control:nth-child(9)")).sendKeys("12");
        driver.findElement(By.cssSelector("button.btn:nth-child(2)")).click();
        System.out.println(driver.getPageSource().contains("Invalid password"));
        Thread.sleep(1000);
        driver.findElement(By.cssSelector("input.form-control:nth-child(9)")).sendKeys("345");

        driver.findElement(By.cssSelector("select.form-control:nth-child(2)")).sendKeys("Active");
        driver.findElement(By.cssSelector("select.form-control:nth-child(4)")).sendKeys("Coordinator");
        Thread.sleep(1000);
        driver.findElement(By.cssSelector("button.btn:nth-child(2)")).click();
        
        
        
        
        driver2.findElement(By.id("firstname")).clear();
        driver2.findElement(By.id("firstname")).sendKeys("ESES");

        Thread.sleep(1000);
        driver2.findElement(By.id("password")).clear();
        driver2.findElement(By.id("password")).sendKeys("12345");
//        System.out.println("---------------");
        Thread.sleep(1000);
        driver2.findElement(By.cssSelector("button.waves-effect:nth-child(1)")).click();
        
        Thread.sleep(1000);
        driver2.findElement(By.linkText("Announcements")).click();
        Thread.sleep(1000);
        driver2.findElement(By.cssSelector(".form-control")).sendKeys("FSE is best!");
        Thread.sleep(1000);
        driver2.findElement(By.cssSelector("button.btn:nth-child(1)")).click();
        System.out.println(driver2.getPageSource().contains("FSE is best!"));
        
        
    }

}
