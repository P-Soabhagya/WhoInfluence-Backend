const saveToExcel = require('./src/services/excelService');

async function test() {
  try {
    await saveToExcel({
      name: 'Test',
      email: 'test@example.com',
      phone: '1234567890',
      message: 'Test message',
    });
    console.log("Test successful");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
