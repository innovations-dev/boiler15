import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";

import { baseURL } from "@/lib/utils";
import tailwindConfig from "@/tailwind.config";

interface ResetPasswordEmailProps {
  url: string;
  expiryTime: string;
}

export default function ResetPasswordEmail({
  url,
  expiryTime,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="mx-auto my-[40px] w-full max-w-3xl rounded border border-solid border-[#eaeaea] bg-white p-5">
            <Section className="mt-[32px]">
              <Img
                src={`${baseURL}/logo.png`}
                width="40"
                height="40"
                alt="Logo"
                className="mx-auto"
              />
            </Section>

            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-[#484848]">
              Reset Your Password
            </Heading>

            <Text className="m-0 mb-4 text-center text-base leading-[24px] text-[#484848]">
              A password reset was requested for your account. This link will
              expire in 30 minutes.
            </Text>

            <Section className="mb-8 text-center">
              <Link
                href={url}
                className="inline-block rounded bg-[#0070f3] px-6 py-3 text-center text-base font-semibold text-white no-underline"
              >
                Reset Password
              </Link>
            </Section>

            <Text className="m-0 text-center text-sm text-[#666666]">
              Link expires: {expiryTime}
            </Text>

            <Text className="m-0 text-center text-sm text-[#666666]">
              For security, this link can only be used once.
            </Text>

            <Text className="m-0 text-center text-sm text-[#666666]">
              If you did not request this change, please ignore this email or
              contact support.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Section className="text-center">
              <Text className="m-0 text-[12px] leading-[24px] text-[#666666]">
                This email was intended for you. If you were not expecting this
                email, please contact support.
              </Text>
              <Text className="m-0 text-[12px] leading-[24px] text-[#666666]">
                <Link href={`${baseURL}`} className="text-[#666666] underline">
                  Your Company, Inc
                </Link>
                {" • "}
                <Link
                  href={`${baseURL}/privacy`}
                  className="text-[#666666] underline"
                >
                  Privacy Policy
                </Link>
                {" • "}
                <Link
                  href={`${baseURL}/terms`}
                  className="text-[#666666] underline"
                >
                  Terms of Service
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export const getResetPasswordEmail = async (
  url: string,
  expiryTime: string
) => {
  return await render(
    <ResetPasswordEmail url={url} expiryTime={expiryTime} />,
    { pretty: true }
  );
};
