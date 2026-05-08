// emails/reset-password-email.tsx

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Button,
} from "react-email";

interface ResetPasswordEmailProps {
  resetUrl: string;
}

export default function ResetPasswordEmail({
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#0f0f0f",
          margin: 0,
          padding: "40px 20px",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor: "#181818",
            borderRadius: 16,
            border: "1px solid #2a2a2a",
            padding: "48px 40px",
            maxWidth: 560,
          }}
        >
          {/* Brand */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#ffffff",
              margin: "0 0 4px",
              letterSpacing: "-0.5px",
            }}
          >
            Naga Steel Depots
          </Text>

          <Text
            style={{
              fontSize: 11,
              color: "#555",
              margin: "0 0 36px",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Password Reset
          </Text>

          {/* Title */}
          <Heading
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 12px",
            }}
          >
            Reset your password
          </Heading>

          {/* Description */}
          <Text
            style={{
              fontSize: 15,
              color: "#888",
              margin: "0 0 32px",
              lineHeight: 1.6,
            }}
          >
            We received a request to reset the password for your account. Click
            the button below to choose a new one. This link expires in{" "}
            <strong style={{ color: "#ccc" }}>1 hour</strong>.
          </Text>

          {/* Button */}
          <Button
            href={resetUrl}
            style={{
              backgroundColor: "#10456d",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 14,
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Reset Password →
          </Button>

          {/* Footer note */}
          <Text
            style={{
              fontSize: 13,
              color: "#555",
              margin: "32px 0 0",
              lineHeight: 1.6,
            }}
          >
            If you didn’t request this, you can safely ignore this email — your
            password won’t change.
          </Text>

          <Hr
            style={{
              borderColor: "#2a2a2a",
              margin: "32px 0",
            }}
          />

          <Text
            style={{
              fontSize: 11,
              color: "#444",
              margin: 0,
            }}
          >
            Or copy this link into your browser:
            <br />
            <Link
              href={resetUrl}
              style={{
                color: "#666",
                wordBreak: "break-all",
              }}
            >
              {resetUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
