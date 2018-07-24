package test;

import org.openqa.selenium.firefox.FirefoxDriver;

import java.util.regex.Pattern;
import java.net.UnknownHostException;
import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;

import com.mongodb.DB;
import com.mongodb.Mongo;

public class volunteer {
	 private WebDriver driver;
	  private boolean acceptNextAlert = true;
	  private StringBuffer verificationErrors = new StringBuffer();

	  @Before
	  public void setUp() throws Exception {
		  System.setProperty("webdriver.gecko.driver", "/Users/sheersha/Downloads/geckodriver");
	    driver = new FirefoxDriver();
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	  }


	  @Test
	   public void testContri() throws Exception {
		  Mongo mongo = new Mongo("localhost", 27017);
	        DB db = mongo.getDB("FSE");
	        db.getCollection("users").drop();
	        System.out.println("DB reset!");
		String username = "sk1",
		       password ="1234",
		       email ="1@123.com",
		       choice1 ="Food",
		       choice2 ="Money",
		       choice3 ="Medicines",
		       choice4="Others",
		      username2="sk2",
		      passowrd2="5678",
		      email2="sk2@sw.com";

//      Pre-requisites Test Case 1 to 5:
	    driver.get("http://localhost:3000/#/");
	    driver.findElement(By.id("firstname")).clear();
	    driver.findElement(By.id("firstname")).sendKeys(username);
	    driver.findElement(By.id("password")).clear();
	    driver.findElement(By.id("password")).sendKeys(password);
	    driver.findElement(By.xpath("//div[@id='signup']/div/form/div[4]/button")).click();
	    driver.findElement(By.id("email")).clear();
	    driver.findElement(By.id("email")).sendKeys(email);
	    driver.findElement(By.xpath("id('signup')//div//form//div[5]//button[1]")).click();
	    
	    System.out.println("Logged in "+username);
//---------------------------------------------------------------------------------------------------
//	    TEST CASE 1 : First User, Empty Contribution Database
//-----------------------------------------------------------------------------------------------------
	    System.out.println("\n"+"TEST CASE 1");
	    System.out.println("Test Case : First User, Empty Contribution Database");
	    driver.findElement(By.linkText("Manage Volunteers/Donations")).click();
	    System.out.println("inside Manage Volunteers/Donations ");
	    System.out.println("Check if db is empty");
	    driver.findElement(By.xpath("//html//body//div//div[2]//div//div[2]//button")).click();
	    
	    String emptyDb = driver.findElement(By.xpath("//html//body//div//div[2]//div//div[4]//table")).getText();
	    
	    System.out.println("emptyDb"+emptyDb);
	    if(!emptyDb.contains(username))
	    {
	    	System.out.println("Db is empty ");
	    }
	    else
	    {
	    	System.out.println("Error:Db is not empty");
	    	
	    }
	    
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
	    driver.findElement(By.linkText("Home")).click();
	    
	    System.out.println("First User, Empty Contribution Database TESTED");
//---------------------------------------------------------------------------------------------------
//	    TEST CASE 2 : BASIC FLOW 
//-----------------------------------------------------------------------------------------------------
	    System.out.println("\n"+"TEST CASE 2");
	    System.out.println("Test Case : Basic Flow ");
	    driver.manage().timeouts().implicitlyWait(100, TimeUnit.SECONDS);
	    driver.findElement(By.linkText("Manage Volunteers/Donations")).click();
	    System.out.println("inside Manage Volunteers/Donations ");
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
	    driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
	    
	    driver.findElement(By.xpath("//html//body//div//div[2]//div//div[3]//table//tbody//tr[1]//td[1]//input")).click();
	    String testChoice = driver.findElement(By.xpath("//html//body//div//div[2]//div//div[3]//table//tbody//tr[1]")).getText();
	    driver.findElement(By.cssSelector("button[type=\"submit\"]")).click();
	    System.out.println("testChoice1:"+testChoice+"choice1"+choice1);
	    
	    System.out.println("choice entered");
	 
	    String text= driver.getPageSource();
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	   
	    if(testChoice.contains("food")||text.contains("Thankyou!"))
	    {
	    	System.out.println("Confirmation choice submitted: "+testChoice);
	    }
	    else
	    {
	    	System.out.println("Error:Choice submission failure: "+testChoice);
	    	
	    }
	    
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    System.out.println("Check status updated");
	    String status = driver.findElement(By.xpath("//html//body//div//div[2]//div[2]//table//tbody//tr[1]//td[1]")).getText();
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    String status1 = driver.findElement(By.xpath("//html//body//div//div[2]//div[2]//table//tbody//tr[1]//td[2]")).getText();
	    System.out.println("Page_Source:"+status +"&"+status1);
	    if(status.contains(username)&&status1.contains("Food"))
	    {
	    	System.out.println("Latest contribution status contains:"+username+" contributed:" +status+"--choice1:"+choice1);
	    }
	    else
	    {
	    	System.out.println("Error:Latest contribution status doesnot contains :"+username+" contributed:" +status+"--choice1:"+choice1);
	    	
	    }
	    driver.findElement(By.cssSelector("td > button[type=\"button\"]")).click();
	    System.out.println("BASIC FLOW TESTED");
	    
//-----------------------------------------------------------------------------------------------------------
//	    TEST CASE 3:Testing A1 - Contribution Page from home page
//-----------------------------------------------------------------------------------------------------

	    System.out.println("\n"+"TEST CASE 3");
	    System.out.println("Testing A1 - Contribution Page from home page ");
	    driver.findElement(By.linkText("Home")).click();
	    System.out.println("inside Home");
	    driver.findElement(By.xpath("(//a[contains(@href, '#volunteer')])[2]")).click();
	    System.out.println("inside Manage Volunteers/Donations ");
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
		   
	    driver.findElement(By.xpath("//tr[3]/td/input")).click();
	    String testChoice2 =  driver.findElement(By.xpath("//tr[3]/td/input")).getAttribute("value");
	    System.out.println("testChoice2:"+testChoice2);
	     
	    driver.findElement(By.cssSelector("button[type=\"submit\"]")).click();
	    
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    text= driver.getPageSource();
	    if(text.contains("Thankyou!")&& testChoice2.contains(choice2))
	    {
	    	System.out.println("Confirmation choice submitted: "+testChoice2);
	    }
	    
	    else
	    {
	    	System.out.println("Error:Choice submission failure: "+testChoice2);
	    	
	    }
	    
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    System.out.println("Check status updated");
	    status= driver.getPageSource();
	    if(status.contains(username)&&status.contains(choice2))
	    {
	    	System.out.println("Latest contribution status contains"+username+" contributed:" +choice2);
	    }
	    else
	    {
	    	System.out.println("Error: Latest contribution status doesnot contains :"+username+" contributed :" +choice2);
	    	
	    }
	    driver.findElement(By.cssSelector("td > button[type=\"button\"]")).click();
	    System.out.println("A1 - Contribution Page from home page TESTED");
//-----------------------------------------------------------------------------------------------------	    
//	    TEST CASE 4 : Testing A2 - Citizen does not submit his choice,navigates back 
//-----------------------------------------------------------------------------------------------------
	    System.out.println("\n"+"TEST CASE 4");
	    System.out.println("Testing A2 - Citizen does not submit his choice,navigates back ");
	    driver.findElement(By.linkText("Manage Volunteers/Donations")).click();
	    System.out.println("inside Manage Volunteers/Donations ");
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
	    driver.findElement(By.xpath("//tr[2]/td/input")).click();
	   
	    String testChoice3 = driver.findElement(By.xpath("//tr[2]/td/input")).getAttribute("value");
	    
	    System.out.println("testChoice3:"+testChoice3);
	    
	    driver.findElement(By.cssSelector("button[type=\"cancel\"]")).click();
	    System.out.println("Cancelled");
	    text=driver.getPageSource();
	    driver.manage().timeouts().implicitlyWait(50, TimeUnit.SECONDS);
	   
	    if(testChoice3.contains(choice3))
	    {
	    	System.out.println("Confirmation choice cancelled: "+testChoice3);
	    }
	    else
	    {
	    	System.out.println("Error:Confirmation choice not cancelled:"+testChoice3);
	    	
	    }
	    
	    driver.findElement(By.xpath("(//button[@type='button'])[3]")).click();
	    String contriTable = driver.findElement(By.xpath("//html//body//div//div[2]//div//div[4]//table//tbody//tr[1]")).getText();
	    System.out.println("contriTable: "+contriTable);
	 	  
	    

	    status= driver.getPageSource();
	    if(status.contains(username)&&!contriTable.contains(choice3))
	    {
	    	System.out.println("Choice was not submitted for "+username+" :" +choice3);
	    }
	    else
	    {
	    	System.out.println("Error: Choice was submitted for "+username+" :" +choice3);
	    	
	    }
	    driver.findElement(By.xpath("//button[@value='ok']")).click();

	    System.out.println("A2 - Citizen does not submit his choice,navigates back TESTED");
	    
//-----------------------------------------------------------------------------------------------------	    
//	    TEST CASE 5 : Testing A3 - Citizen does not view contribution status, only makes contribution
//-----------------------------------------------------------------------------------------------------
	    System.out.println("\n"+"TEST CASE 5");
	    System.out.println("Testing A3 - Citizen does not view contribution status, only makes contribution");
	    driver.findElement(By.linkText("Manage Volunteers/Donations")).click();
	    System.out.println("inside Manage Volunteers/Donations ");
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
	    driver.findElement(By.xpath("//tr[2]/td/input")).click();
	   
	    testChoice3 = driver.findElement(By.xpath("//tr[2]/td/input")).getAttribute("value");
	    
	    System.out.println("testChoice3:"+testChoice3);
	    
	    driver.findElement(By.cssSelector("button[type=\"submit\"]")).click();
	    status= driver.getPageSource();
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    if(testChoice3.contains(choice3)&&status.contains("Thankyou!"))
	    {
	    	System.out.println("Confirmation choice submitted: "+testChoice3);
	    }
	    
	    else
	    {
	    	System.out.println("Error:Choice submission failure: "+testChoice3);
	    	
	    }
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
		  
	    contriTable = driver.findElement(By.xpath("//html//body//div//div[2]//div[2]//table//tbody//tr[1]//td[2]")).getText();
	    String contriTable1 = driver.findElement(By.xpath("//html//body//div//div[2]//div[2]//table//tbody//tr[1]//td[1]")).getText();
	    
	    System.out.println("contriTable: "+contriTable+"contriTable1: "+contriTable1);


	    if(contriTable1.contains(username)&&contriTable.contains(testChoice3))
	    {
	    	System.out.println("Choice was submitted for "+username+" :" +testChoice3);
	    }
	    else
	    {
	    	System.out.println("Error: Choice was submitted for "+username+" :" +testChoice3);
	    	
	    }
	    driver.findElement(By.xpath("//button[@value='ok']")).click();

	    System.out.println("A3 - Citizen does not view contribution status, only makes contribution TESTED");
	    
	    driver.findElement(By.linkText("Logout")).click();
	    System.out.println("\n"+username+" Logged out");
	    
	    
//      Pre-requisites Test Case 6 ot 7:
	    driver.get("http://localhost:3000/#/");
	    driver.findElement(By.id("firstname")).clear();
	    driver.findElement(By.id("firstname")).sendKeys(username2);
	    driver.findElement(By.id("password")).clear();
	    driver.findElement(By.id("password")).sendKeys(passowrd2);
	    driver.findElement(By.xpath("//div[@id='signup']/div/form/div[4]/button")).click();
	    driver.findElement(By.id("email")).clear();
	    driver.findElement(By.id("email")).sendKeys(email2);
	    driver.findElement(By.xpath("id('signup')//div//form//div[5]//button[1]")).click();
	    
	    System.out.println("Logged in "+username2);
	    
//-----------------------------------------------------------------------------------------------------	    
//	    TEST CASE 6 : Testing A5 - Citizen does not make contribution,only views the latest status
//-----------------------------------------------------------------------------------------------------
	    System.out.println("\n"+"TEST CASE 6");
	    System.out.println("Testing A5 - Citizen does not make contribution,only views the latest status ");
	    driver.findElement(By.linkText("Manage Volunteers/Donations")).click();
	    System.out.println("inside Manage Volunteers/Donations ");
	    driver.findElement(By.xpath("(//button[@type='button'])[3]")).click();
	    System.out.println("Viewwing Current Contribution Status:"+testChoice3);
	    
	    contriTable = driver.findElement(By.xpath("//html//body//div//div[2]//div//div[4]//table//tbody//tr[1]")).getText();
	    System.out.println("contriTable: "+contriTable);

	    if(!contriTable.contains(username2)&& !contriTable.isEmpty())
	    {
	    	System.out.println("Successfully viewed the contributions ");
	    }
	    else
	    {
	    	System.out.println("Error: Could not view contributions of other users");
	    	
	    }
	    driver.findElement(By.xpath("//button[@value='ok']")).click();

	    System.out.println("A5 - Citizen does not make contribution,only views the latest status TESTED");
	    
//-----------------------------------------------------------------------------------------------------	    
//	    TEST CASE 7 : Contribution by another user
//-----------------------------------------------------------------------------------------------------

	    System.out.println("\n"+"TEST CASE 7");
	    System.out.println("Contribution by another user: "+username2);
	    driver.findElement(By.linkText("Home")).click();
	    System.out.println("inside Home");
	    driver.findElement(By.xpath("(//a[contains(@href, '#volunteer')])[2]")).click();
	    System.out.println("inside Manage Volunteers/Donations ");
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
		   
	    driver.findElement(By.xpath("//tr[7]/td/input")).click();
	    String testChoice4 =  driver.findElement(By.xpath("//tr[7]/td/input")).getAttribute("value");
	    System.out.println("testChoice4:"+testChoice4);
	     
	    driver.findElement(By.cssSelector("button[type=\"submit\"]")).click();
	    
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    text= driver.getPageSource();
	    if(text.contains("Thankyou!")&& testChoice4.contains(choice4))
	    {
	    	System.out.println("Confirmation choice submitted: "+testChoice4);
	    }
	    
	    else
	    {
	    	System.out.println("Error:Choice submission failure: "+testChoice4);
	    	
	    }
	    
	    driver.findElement(By.xpath("(//button[@type='button'])[2]")).click();
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	    System.out.println("Check updated status");
	    status= driver.getPageSource();
	    if(status.contains(username2)&&status.contains(choice4)&&status.contains(username)&&status.contains(choice3))
	    {
	    	System.out.println("Latest contribution status contains "+username2+" contributed:" +choice4);
	    }
	    else
	    {
	    	System.out.println("Error: Latest contribution status doesnot contains "+username2+" contributed :" +choice4);
	    	
	    }
	    driver.findElement(By.cssSelector("td > button[type=\"button\"]")).click();
	    System.out.println("Contribution by another user: "+username2+" TESTED");
	  }

	  @After
	  public void tearDown() throws Exception {
	    driver.quit();
	    String verificationErrorString = verificationErrors.toString();
	    if (!"".equals(verificationErrorString)) {
	      fail(verificationErrorString);
	    }
	  }
	}


