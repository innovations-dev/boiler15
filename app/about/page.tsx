import { Metadata } from "next";
import Image from "next/image";
import { Award, Heart, Target, TrendingUp, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { generateMetadata } from "@/config/meta.config";

export const metadata: Metadata = await generateMetadata({
  title: "About Us",
  description: "Learn more about our company, mission, and values",
});

export default function AboutPage() {
  return (
    <div className="my-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pb-16 pt-20 text-center">
        <h1 className="mx-auto mb-6 max-w-[800px] text-4xl font-bold tracking-tight sm:text-6xl">
          Our Story
        </h1>
        <p className="mx-auto mb-8 max-w-[600px] text-lg text-muted-foreground">
          Building the future of web development with modern tools and
          practices.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="border-zinc-800 bg-zinc-900/50 p-8">
            <Target className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-4 text-2xl font-semibold">Our Mission</h3>
            <p className="text-muted-foreground">
              To empower developers with cutting-edge tools and frameworks,
              enabling them to build exceptional web applications efficiently
              and effectively.
            </p>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 p-8">
            <TrendingUp className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-4 text-2xl font-semibold">Our Vision</h3>
            <p className="text-muted-foreground">
              To be the leading force in modern web development, setting
              standards for quality, performance, and developer experience.
            </p>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-900/50 p-6">
            <Award className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Excellence</h3>
            <p className="text-muted-foreground">
              Striving for the highest quality in everything we do
            </p>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 p-6">
            <Heart className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Passion</h3>
            <p className="text-muted-foreground">
              Deep love for technology and innovation
            </p>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 p-6">
            <Users className="mb-4 h-10 w-10 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Community</h3>
            <p className="text-muted-foreground">
              Building and supporting the developer community
            </p>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Team</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="overflow-hidden border-zinc-800 bg-zinc-900/50"
            >
              <div className="relative aspect-square">
                <Image
                  src={`https://picsum.photos/seed/${i}/400`}
                  alt={`Team Member ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-1 text-xl font-semibold">Team Member {i}</h3>
                <p className="text-sm text-muted-foreground">Co-Founder</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Company Stats */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold">5+</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Years Experience
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">100+</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Projects Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">50+</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Team Members
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">20+</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Countries Reached
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
