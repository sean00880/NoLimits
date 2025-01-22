"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { exteriorServices, interiorServices } from "../app/data/servicesData";
import { VehicleType } from "./PackagesSection";

interface ServicesSectionProps {
  vehicleType: VehicleType;
}

export function ServicesSection({ vehicleType }: ServicesSectionProps) {
  // Helper to pick the correct price
  const getPrice = (srv: any) => {
    switch (vehicleType) {
      case "suvTruck":
        return srv.suvTruckPrice;
      case "van":
        return srv.vanPrice;
      default:
        return srv.sedanPrice;
    }
  };

  // Renders a grid of service cards for either exterior or interior
  const renderServices = (services: typeof exteriorServices) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {services.map((srv) => {
          const price = getPrice(srv);

          return (
            <Card
              key={srv.name}
              className="
                relative
                bg-white/10
                backdrop-blur-md
                border border-white/20
                text-white
                shadow-lg
                hover:shadow-xl
                hover:scale-[1.02]
                transition-transform
                overflow-hidden
                flex
                flex-col
              "
            >
              {/* Top image (srv.img) */}
              <div className="relative w-full h-40">
                <Image
                  src={srv.img} // Path stored in srv.img
                  alt={srv.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name (left) + Price (right) */}
              <div className="flex items-center justify-between p-4 pb-0">
                <h3 className="text-xl font-semibold">{srv.name}</h3>
                <span className="text-lg font-bold text-green-400">${price}</span>
              </div>

              {/* Description content */}
              <CardContent className="px-4 pt-2 pb-4 flex-1 space-y-2">
                {srv.description.map((line: string, idx: number) => (
                  <p key={idx} className="text-sm text-white/80 leading-relaxed">
                    {line}
                  </p>
                ))}
              </CardContent>

              {/* CTA: Book Now */}
              <div className="px-4 pb-4 mt-auto flex justify-center">
                <Link href={`/booking?service=${srv.name}`}>
                  <Button className="bg-green-600 hover:bg-green-700 text-sm">
                    Book Now
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  // Tab logic for exterior vs. interior
  const [activeTab, setActiveTab] = React.useState<"exterior" | "interior">("exterior");

  return (
    <section className="space-y-4 my-8">
      <h2 className="text-3xl font-semibold text-white">Services</h2>

      {/* Tab Buttons */}
      <div className="flex space-x-4">
        <Button
          variant={activeTab === "exterior" ? "default" : "secondary"}
          onClick={() => setActiveTab("exterior")}
        >
          Exterior
        </Button>
        <Button
          variant={activeTab === "interior" ? "default" : "secondary"}
          onClick={() => setActiveTab("interior")}
        >
          Interior
        </Button>
      </div>

      {/* Conditionally render the grid */}
      {activeTab === "exterior" && renderServices(exteriorServices)}
      {activeTab === "interior" && renderServices(interiorServices)}
    </section>
  );
}
