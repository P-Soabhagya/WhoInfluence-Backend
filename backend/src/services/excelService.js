const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const COLUMNS = [
  { header: "Name", key: "name", width: 25 },
  { header: "Email", key: "email", width: 30 },
  { header: "Brand", key: "brand", width: 25 },
  { header: "Message", key: "message", width: 40 },
  { header: "Phone", key: "phone", width: 20 },
  { header: "Social Links", key: "socialLinks", width: 30 },
  { header: "Date", key: "date", width: 28 },
];

const filePath = path.join(__dirname, "../../leads.xlsx");

const saveToExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  let worksheet;
  const isNew = !fs.existsSync(filePath);

  try {
    if (!isNew) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet("Leads") || workbook.addWorksheet("Leads");
    } else {
      worksheet = workbook.addWorksheet("Leads");
    }

    // Always ensure columns are defined (fixes missing-header bug on existing files)
    worksheet.columns = COLUMNS;

    // Style the header row on first creation
    if (isNew) {
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE26A00" },
      };
      headerRow.alignment = { vertical: "middle", horizontal: "center" };
      headerRow.height = 20;
      headerRow.commit();
    }

    // Append the new row
    worksheet.addRow({
      name: data.name || "",
      email: data.email || "",
      brand: data.brand || "",
      message: data.message || "",
      phone: data.phone || "",
      socialLinks: data.socialLinks || "",
      date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    await workbook.xlsx.writeFile(filePath);
    console.log("✅ Saved to Excel:", filePath);
  } catch (err) {
    console.error("❌ Excel write failed:", err.message);
    throw err;
  }
};

module.exports = saveToExcel;