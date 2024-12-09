import AWS from "aws-sdk";
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETKEY,
});

export const sendEmailAWSSignUp = async ({ data, token }) => {
  const ses = new AWS.SES({ apiVersion: "2010-12-01" });

  const params = {
    Source: `"MIXIVIVU" <${process.env.EMAIL_ROOT}>`,
    Destination: {
      ToAddresses: [data.email],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Verify Email ✔",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<!DOCTYPE html>
      <html>
      <head>
          <title>Xác minh địa chỉ email của bạn</title>
      </head>
      <body>
          <h1>Xin chào, ${data.fullName}</h1>
          <p>Cảm ơn bạn đã đăng ký! Chúng tôi chỉ cần bạn xác minh địa chỉ email của mình để hoàn tất quá trình đăng ký.</p>
          <p>Vui lòng nhấp vào liên kết dưới đây để xác minh địa chỉ email của bạn:</p>
          <a href="${process.env.URL_FE_VERIFY}?token=${token}">Xác minh email</a>
          <p>Nếu bạn không yêu cầu đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
          <p>Trân trọng</p>
          <p>Đội ngũ hỗ trợ của bạn</p>
      </body>
      </html>
      `,
        },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};


