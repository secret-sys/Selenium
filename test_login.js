const { Builder, By, until } = require("selenium-webdriver");
const edge = require("selenium-webdriver/edge");

async function runTests() {
  let driver;

  try {
    console.log("Initializing EdgeDriver...");
    const edgeOptions = new edge.Options();
    edgeOptions.addArguments("--start-maximized", "--disable-gpu", "--no-sandbox");

    driver = await new Builder()
      .forBrowser("MicrosoftEdge")  // Set browser to Edge
      .setEdgeOptions(edgeOptions)  // Use the Edge options
      .build();
    console.log("EdgeDriver initialized successfully");

    // Test 1: Successful login
    await driver.get("file://" + __dirname + "/index.html");
    await driver.wait(until.elementLocated(By.id("username")), 5000).sendKeys("admin");
    await driver.findElement(By.id("password")).sendKeys("admin123");
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    console.log("Alert text:", await alert.getText());
    await alert.accept();

    // Test 2: Empty username error
    await driver.get("file://" + __dirname + "/index.html");
    await driver.findElement(By.css('button[type="submit"]')).click();
    const usernameError = await driver.findElement(By.id("usernameError"));
    console.log("Username error displayed:", await usernameError.isDisplayed());

    // Test 3: Empty password error
    await driver.get("file://" + __dirname + "/index.html");
    await driver.findElement(By.id("username")).sendKeys("admin");
    await driver.findElement(By.css('button[type="submit"]')).click();
    const passwordError = await driver.findElement(By.id("passwordError"));
    console.log("Password error displayed:", await passwordError.isDisplayed());

    // Test 4: Invalid username error
    await driver.get("file://" + __dirname + "/index.html");
    await driver.findElement(By.id("username")).sendKeys("invaliduser");
    await driver.findElement(By.id("password")).sendKeys("anypassword");
    await driver.findElement(By.css('button[type="submit"]')).click();
    const formError1 = await driver.findElement(By.id("formError"));
    console.log("Form error displayed:", await formError1.isDisplayed());
    const errorMessage1 = await driver.findElement(By.id("errorMessage")).getText();
    console.log("Error message:", errorMessage1);

    // Test 5: Invalid password error
    await driver.get("file://" + __dirname + "/index.html");
    await driver.findElement(By.id("username")).sendKeys("admin");
    await driver.findElement(By.id("password")).sendKeys("wrongpassword");
    await driver.findElement(By.css('button[type="submit"]')).click();
    const formError2 = await driver.findElement(By.id("formError"));
    console.log("Form error displayed:", await formError2.isDisplayed());
    const errorMessage2 = await driver.findElement(By.id("errorMessage")).getText();
    console.log("Error message:", errorMessage2);
  } catch (error) {
    console.error("Test execution error:", error);
  } finally {
    if (driver) {
      await driver.quit();
      console.log("EdgeDriver closed successfully");
    }
  }
}

runTests();
