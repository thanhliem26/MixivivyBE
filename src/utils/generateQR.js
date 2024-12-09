const axios = require("axios");

async function generateQR({accountNo, accountName, acqId, amount, addInfo}) {
  try {
    const requestData = {
        accountNo: accountNo,
        accountName: accountName,
        acqId: acqId,
        amount: amount,
        addInfo: addInfo,
        format: "text",
        template: "compact2"
      };

    const response = await axios.post("https://api.vietqr.io/v2/generate", requestData, {
      headers: {
        "Content-Type": "application/json", // Đảm bảo server nhận dạng đúng kiểu dữ liệu
      },
    });

    return response.data?.data?.qrDataURL;

  } catch (error) {
    console.error("Lỗi khi gọi API:", error.message);
  }
}

module.exports = {
  generateQR,
};
