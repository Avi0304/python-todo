import smtplib
import os

def send_email(to_email, subject, body):
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USERNAME")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    email_from = os.getenv("EMAIL_FROM")

    if not all([smtp_server, smtp_port, smtp_user, smtp_pass, email_from]):
        raise ValueError("Email configuration is incomplete in environment variables.")

    with smtplib.SMTP(smtp_server, int(smtp_port)) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        message = f"Subject: {subject}\n\n{body}"
        server.sendmail(email_from, to_email, message)
