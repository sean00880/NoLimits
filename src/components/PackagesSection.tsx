"use client";
import { packagesData } from "../app/data/packagesData";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import Link from "next/link";
import { Button } from "../components/ui/button";
import Image from "next/image";

export type VehicleType = "sedan" | "suvTruck" | "van";

interface PackagesSectionProps {
  vehicleType: VehicleType;
}

export function PackagesSection({ vehicleType }: PackagesSectionProps) {
  // Helper to get correct price
  const getPrice = (pkg: any) => {
    switch (vehicleType) {
      case "suvTruck":
        return pkg.suvTruckPrice;
      case "van":
        return pkg.vanPrice;
      default:
        return pkg.sedanPrice;
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-3xl font-semibold text-white mb-6">Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packagesData.map((pkg) => {
          const price = getPrice(pkg);

          return (
            <Card
              key={pkg.name}
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
                flex flex-col
              "
            >
              {/* OPTIONAL IMAGE at the top */}
            
              <div className="relative w-full h-80">
                <Image
                  src={pkg.img} // Replace with your image path
                  alt={pkg.name}
                  fill
                  className="object-cover"
                />
              </div>
          

              {/* Header row: Title on left, Price on right */}
              <div className="flex items-center justify-between p-4 pb-0">
                <h3 className="text-xl font-semibold">{pkg.name}</h3>
                <span className="text-lg font-bold text-green-400">
                  ${price}
                </span>
              </div>

              {/* Card content */}
              <CardContent className="px-4 pt-2 pb-4 flex-1 space-y-2">
                {/* Show a short snippet so it doesn't get too tall */}
                {pkg.description.map((line: string, idx: number) => (
                  <p key={idx} className="text-sm text-white/80 leading-relaxed">
                    {line}
                  </p>
                ))}
              </CardContent>

              {/* CTA region */}
              <div className="relative mt-auto px-4 pb-6">
                {/* Book Now centered */}
                <div className="flex justify-center">
                  <Link href={`/booking?service=${pkg.name}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-sm">
                      Book Now
                    </Button>
                  </Link>
                </div>

                {/* Read More link absolutely positioned in bottom-right */}
                <Link
                  href={`/services/${pkg.name}`}
                  className="
                    absolute
                    bottom-2
                    right-4
                    text-sm
                    underline
                    text-white/80
                    hover:text-green-300
                    transition-colors
                  "
                >
                  Read More
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
