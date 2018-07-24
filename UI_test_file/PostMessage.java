package selenium;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.Mongo;

public class PostMessage {
    static Mongo mongo=null;
    static DB db=null;
    public static void initialize() throws UnknownHostException
    {
        mongo = new Mongo("ec2-52-204-117-72.compute-1.amazonaws.com", 27017);
        db = mongo.getDB("FSE");
        db.dropDatabase();
        BasicDBObject doc = new BasicDBObject("username", "tester1").append("password", "1234");
        db.getCollection("users").insert(doc); 
        doc = new BasicDBObject("username", "tester2").append("password", "1234");
        db.getCollection("users").insert(doc); 
        System.out.println("DB reset!");
        
    }
    
    
    public boolean isTextPresent(WebDriver driver,String txtValue){
        boolean b = false;
        try{
            b = driver.getPageSource().contains(txtValue);
            return b;
        }
        catch (Exception e){
            System.out.println(e.getMessage());
        }    
            finally{
             return b;
            }
    }
    
    
    public static void main(String[] args) throws InterruptedException, UnknownHostException {
        initialize();
        String path = "C:\\Users\\32842\\OneDrive\\jar\\selenium\\geckodriver.exe";
        System.setProperty("webdriver.gecko.driver", path);
        // TODO Auto-generated method stub
        // Create a new instance of the Firefox driver
                WebDriver driver = new FirefoxDriver();
                WebDriver driver2 = new FirefoxDriver();
//                driver = new ChromeDriver();
                Thread.sleep(50);
                
                //Launch the Online Store Website
                driver.get("http://localhost:3000");
                driver.findElement(By.id("firstname")).clear();
                driver.findElement(By.id("firstname")).sendKeys("tester1");

                Thread.sleep(1000);
                driver.findElement(By.id("password")).clear();
                driver.findElement(By.id("password")).sendKeys("1234");

                Thread.sleep(1000);
                driver.findElement(By.cssSelector("button.waves-effect:nth-child(1)")).click();
                // Print a Log In message to the screen
//                System.out.println("Successfully opened the website www.Store.Demoqa.com");
//                driver.findElement(By.cssSelector(".nav > li:nth-child(6) > a:nth-child(1)")).click();
                Thread.sleep(1000);
                driver.findElement(By.cssSelector(".nav > li:nth-child(6) > a:nth-child(1)")).click();
                
                //Wait for 5 Second
                Thread.sleep(1000);
                driver.findElement(By.xpath("//a/button")).click();
                Thread.sleep(1000);
                
                driver.findElement(By.id("GroupName")).clear();
                driver.findElement(By.id("GroupName")).sendKeys("Hello");
                Thread.sleep(1000);
                driver.findElement(By.id("description")).clear();
                driver.findElement(By.id("description")).sendKeys("HelloWorld");
                Thread.sleep(1000);
                driver.findElement(By.id("user1")).clear();
                driver.findElement(By.id("user1")).sendKeys("tester2");
                
                Thread.sleep(1000);

                driver.findElement(By.xpath("//div[6]/button")).click();
                Thread.sleep(2000);
                
                driver2.get("http://localhost:3000");
                driver2.findElement(By.id("firstname")).clear();
                driver2.findElement(By.id("firstname")).sendKeys("tester2");

                Thread.sleep(1000);
                driver2.findElement(By.id("password")).clear();
                driver2.findElement(By.id("password")).sendKeys("1234");

                Thread.sleep(1000);
                driver2.findElement(By.cssSelector("button.waves-effect:nth-child(1)")).click();
                // Print a Log In message to the screen
//                System.out.println("Successfully opened the website www.Store.Demoqa.com");
//                driver.findElement(By.cssSelector(".nav > li:nth-child(6) > a:nth-child(1)")).click();
                Thread.sleep(1000);
                driver2.findElement(By.cssSelector(".nav > li:nth-child(6) > a:nth-child(1)")).click();
                Thread.sleep(1000);
                driver2.findElement(By.linkText("Hello")).click();
                
                driver2.findElement(By.xpath("//input")).sendKeys("FSEisBest");
                Thread.sleep(1000);
                driver2.findElement(By.xpath("//span/button")).click();     
                Thread.sleep(1000);
                
                driver.findElement(By.xpath("//input")).sendKeys("World");
                Thread.sleep(1000);
                driver.findElement(By.xpath("//span/button")).click();     
                Thread.sleep(1000);
                System.out.println(driver.getPageSource().contains("FSEisBest"));
                System.out.println(driver2.getPageSource().contains("FSEisBest"));
                System.out.println(driver.getPageSource().contains("FSEisBest"));
                System.out.println(driver2.getPageSource().contains("FSEisBest"));
                // Close the driver
//                driver.quit();

    }

}