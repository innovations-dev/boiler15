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

import tailwindConfig from "@/tailwind.config";

interface MagicLinkEmailProps {
  url: string;
}

export default function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

  return (
    <Html>
      <Head />
      <Preview>Your login link for the application</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="mx-auto my-[40px] w-full max-w-3xl rounded border border-solid border-[#eaeaea] bg-white p-5">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/logo.png`}
                width="40"
                height="40"
                alt="Logo"
                className="mx-auto"
              />
            </Section>

            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-[#484848]">
              Login to Your Account
            </Heading>

            <Text className="m-0 mb-4 text-center text-base leading-[24px] text-[#484848]">
              Click the button below to sign in to your account. This link will
              expire in 15 minutes.
            </Text>

            <Section className="mb-8 text-center">
              <Link
                href={url}
                className="inline-block rounded bg-[#0070f3] px-6 py-3 text-center text-base font-semibold text-white no-underline"
              >
                Sign In
              </Link>
            </Section>

            <Text className="m-0 text-center text-sm text-[#666666]">
              If you didn't request this email, you can safely ignore it.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Section className="text-center">
              <Text className="m-0 text-[12px] leading-[24px] text-[#666666]">
                This email was intended for you. If you were not expecting this
                email, please contact support.
              </Text>
              <Text className="m-0 text-[12px] leading-[24px] text-[#666666]">
                <Link href={`${baseUrl}`} className="text-[#666666] underline">
                  Your Company, Inc
                </Link>
                {" • "}
                <Link
                  href={`${baseUrl}/privacy`}
                  className="text-[#666666] underline"
                >
                  Privacy Policy
                </Link>
                {" • "}
                <Link
                  href={`${baseUrl}/terms`}
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

export const getMagicLinkEmail = async (url: string) => {
  return await render(<MagicLinkEmail url={url} />, { pretty: true });
};
