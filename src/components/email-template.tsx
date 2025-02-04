import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  details: {
    vehicle_size: string;
    services: string;
    date: string;
    total: number;
    client_name: string;
    client_email: string;
    client_phone: string;
    preferred_time: string;
    alternate_time?: string;
  };
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ firstName, details }) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        color: "#333",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#4caf50",
            color: "#ffffff",
            padding: "15px 20px",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Hello {firstName},
        </div>

        {/* Body */}
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: "16px", marginBottom: "15px" }}>
            A new quote request has been submitted. Below are the details:
          </p>

          {/* Details Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
              border: "1px solid #ddd",
            }}
          >
            <tbody>
              <tr>
                <td style={styles.label}>Vehicle Size:</td>
                <td style={styles.value}>{details.vehicle_size}</td>
              </tr>
              <tr>
                <td style={styles.label}>Services:</td>
                <td style={styles.value}>{JSON.parse(details.services).join(", ")}</td>
              </tr>
              <tr>
                <td style={styles.label}>Date:</td>
                <td style={styles.value}>{details.date}</td>
              </tr>
              <tr>
                <td style={styles.label}>Total:</td>
                <td style={styles.value}>${details.total}</td>
              </tr>
              <tr>
                <td style={styles.label}>Preferred Time:</td>
                <td style={styles.value}>{details.preferred_time}</td>
              </tr>
              <tr>
                <td style={styles.label}>Alternate Time:</td>
                <td style={styles.value}>{details.alternate_time || "Not specified"}</td>
              </tr>
              <tr>
                <td style={styles.label}>Name:</td>
                <td style={styles.value}>{details.client_name}</td>
              </tr>
              <tr>
                <td style={styles.label}>Email:</td>
                <td style={styles.value}>{details.client_email}</td>
              </tr>
              <tr>
                <td style={styles.label}>Phone:</td>
                <td style={styles.value}>{details.client_phone}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ fontSize: "16px", margin: "0" }}>Thank you for using our services!</p>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f1f1f1",
            padding: "15px 20px",
            textAlign: "center",
            fontSize: "12px",
            color: "#888",
          }}
        >
          This is an automated email. Please do not reply.
        </div>
      </div>
    </div>
  );
};

// Reusable Styles for Table Cells
const styles = {
  label: {
    padding: "10px",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
  },
  value: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
};

