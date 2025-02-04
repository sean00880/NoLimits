"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  lawncareServices,
  pressureWashingServices,
  dumpRunServices,
  gardeningServices, // Add this line
} from "../data/servicesData";
import { Calendar, Radio, RadioGroup, Button, ButtonGroup, cn } from "@nextui-org/react";
import { today, getLocalTimeZone, isWeekend, startOfWeek, startOfMonth } from "@internationalized/date";
import { supabase } from "@/components/lib/supaBaseClient";
import { useLocale } from "@react-aria/i18n";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY); // Set RESEND_API_KEY in your .env.local file


// Type for Frequency
type Frequency = "weekly" | "bi-weekly" | "monthly" | "one-time";

// Type for Category
type Category = "lawncare" | "pressureWashing" | "gardening" | "dumpRuns";

type Service = {
  id: string;
  name: string;
  price: number; // Default price based on the selected frequency
  pricing: { weekly: number; "bi-weekly": number; monthly: number; "one-time": number };
  img: string;
  description: string[];
};

type Package = {
  id: string;
  name: string;
  price: number;
  pricing: { weekly: number; "bi-weekly": number; monthly: number; "one-time": number };
  img: string;
  servicesIncluded: string[];
};



/**
 * Example discount combos:
 * - Basic Exterior Wash + Basic Interior Cleaning => $10 off
 * - Standard Exterior Detail + Standard Interior Detail => $20 off
 * - Premium Exterior Detail + Premium Interior Detail => $25 off
 */
const discountCombos = [
  { exterior: "Basic Exterior Wash", interior: "Basic Interior Cleaning", discount: 10 },
  { exterior: "Standard Exterior Detail", interior: "Standard Interior Detail", discount: 20 },
  { exterior: "Premium Exterior Detail", interior: "Premium Interior Detail", discount: 25 },
];

/* 
 The default export is a wrapper that uses <Suspense>. 
 Inside the fallback, you could show a spinner or skeleton. 
 The <BookingContent> does the actual logic with useSearchParams().
*/






export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading booking form...</div>}>
      <BookingContent />
    </Suspense>
  );
}

/* 
 The child component that calls useSearchParams() 
 and renders the booking form. 
*/
function BookingContent() {
  const [lawncareServicesState, setLawncareServices] = useState<Service[]>(
    lawncareServices.services
  );
  const [pressureWashingServicesState, setPressureWashingServices] = useState<Service[]>(
    pressureWashingServices.services
  );
  const [dumpRunServicesState, setDumpRunServices] = useState<Service[]>(
    dumpRunServices.services
  );
  const [gardeningServicesState, setGardeningServices] = useState<Service[]>(
    gardeningServices.services
  );

  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  const categories: Record<Category, { services: Service[]; packages: Package[] }> = {
    lawncare: lawncareServices,
    pressureWashing: pressureWashingServices,
    dumpRuns: dumpRunServices,
    gardening: gardeningServices,
  };
  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone())); // State for selected date

  const [preferredTime, setPreferredTime] = useState<string>("");
  const [alternateTime, setAlternateTime] = useState<string>("");
  
  const [activeCategory, setActiveCategory] = useState<Category>("lawncare");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>("weekly");
  const searchParams = useSearchParams();
  const { locale } = useLocale(); // Correctly use the locale from the hook
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const defaultDate = today(getLocalTimeZone()); // Set the initial value for the calendar
  const [value, setValue] = useState(defaultDate); // State for calendar value
  
    let now = today(getLocalTimeZone());
    let nextWeek = startOfWeek(now.add({weeks: 1}), locale);
    let nextMonth = startOfMonth(now.add({months: 1}));


    function generateSlug(name: string, frequency: Frequency): string {
      return `${name.toLowerCase().replace(/\s+/g, "-")}-${frequency}`;
    }
    

  // On mount, read ?service= from the URL and pre-select if found
  useEffect(() => {
    const servicesParam = searchParams?.get("services");
    const packagesParam = searchParams?.get("packages");
    const frequencyParam = searchParams?.get("frequency");
  
    // Parse and set selected services
    if (servicesParam) {
      try {
        const services = JSON.parse(servicesParam) as string[];
        setSelectedServices(services);
  
        // Determine the category based on the first service
        const matchedCategory = Object.entries(categories).find(([_, category]) =>
          category.services.some((service) => services.includes(service.id))
        );
        if (matchedCategory) setActiveCategory(matchedCategory[0] as Category);
      } catch {
        console.error("Invalid services parameter");
      }
    }
  
    // Parse and set selected packages
    if (packagesParam) {
      try {
        const packages = JSON.parse(packagesParam) as string[];
        setSelectedPackages(packages);
  
        // Determine the category based on the first package
        const matchedCategory = Object.entries(categories).find(([_, category]) =>
          category.packages.some((pkg) => packages.includes(pkg.id))
        );
        
        if (matchedCategory) setActiveCategory(matchedCategory[0] as Category);
  
        // Include services from selected packages
        const includedServices = packages.flatMap((pkgId) =>
          Object.values(categories)
            .flatMap((category) => category.packages)
            .find((pkg) => pkg.id === pkgId)?.servicesIncluded || []
        );
        
        setSelectedServices((prev) => [...new Set([...prev, ...includedServices])]);
      } catch {
        console.error("Invalid packages parameter");
      }
    }
  
    // Set frequency if available
    if (frequencyParam && ["weekly", "bi-weekly", "monthly", "one-time"].includes(frequencyParam)) {
      setSelectedFrequency(frequencyParam as Frequency);
    }
  }, [searchParams]);
  
  
  
  

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) => {
      const updatedServices = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];
  
      // Update URL to reflect the selected services
      const newParams = new URLSearchParams(window.location.search);
      if (updatedServices.length > 0) {
        newParams.set("services", updatedServices.map(encodeURIComponent).join(","));
      } else {
        newParams.delete("services");
      }
      window.history.replaceState(null, "", `?${newParams.toString()}`);
  
      return updatedServices;
    });
  };
  
  
  
  

  function handlePackageToggle(packageId: string) {
    const packageToToggle = Object.values(categories)
      .flatMap((category) => category.packages)
      .find((pkg) => pkg.id === packageId);
  
    if (!packageToToggle) return;
  
    // Toggle the package selection
    setSelectedPackages((prevPackages) => {
      const isAlreadySelected = prevPackages.includes(packageId);
      if (isAlreadySelected) {
        return prevPackages.filter((id) => id !== packageId);
      } else {
        return [...prevPackages, packageId];
      }
    });
  
    // Add or remove the services included in the package
    setSelectedServices((prevServices) => {
      const includedServices = packageToToggle.servicesIncluded;
      const isAlreadySelected = selectedPackages.includes(packageId);
  
      if (isAlreadySelected) {
        // Remove services included in the deselected package
        return prevServices.filter((serviceId) => !includedServices.includes(serviceId));
      } else {
        // Add services included in the newly selected package
        return [...new Set([...prevServices, ...includedServices])];
      }
    });
  }
  
  
  
  
  

  function handleFrequencyChange(newFrequency: Frequency) {
    setSelectedFrequency(newFrequency);
  
    setLawncareServices((prev) =>
      prev.map((service) => ({
        ...service,
        price: service.pricing[newFrequency],
      }))
    );
  
    setPressureWashingServices((prev) =>
      prev.map((service) => ({
        ...service,
        price: service.pricing[newFrequency],
      }))
    );
  
    setDumpRunServices((prev) =>
      prev.map((service) => ({
        ...service,
        price: service.pricing[newFrequency],
      }))
    );
  
    setGardeningServices((prev) =>
      prev.map((service) => ({
        ...service,
        price: service.pricing[newFrequency],
      }))
    );
  }
  
  
  
  
  

  function handleCategoryChange(newCategory: Category) {
    setActiveCategory(newCategory);
  
    // Do not reset `selectedServices` or `selectedPackages`
    // These are maintained globally across categories
  }
  
  
  function isServiceIncludedInAnyPackage(serviceId: string): boolean {
    return selectedPackages.some((pkgId) =>
      Object.values(categories)
        .flatMap((category) => category.packages)
        .find((pkg) => pkg.id === pkgId)
        ?.servicesIncluded.includes(serviceId)
    );
  }
  

  function computeTotal(): number {
    let total = 0;
  
    // Calculate total for selected packages
    selectedPackages.forEach((packageId) => {
      const pkg = Object.values(categories)
        .flatMap((category) => category.packages)
        .find((pkg) => pkg.id === packageId);
    
  
      if (pkg) {
        total += pkg.pricing[selectedFrequency];
      }
    });
  
    // Calculate total for selected services not included in packages
    selectedServices.forEach((serviceId) => {
      if (!isServiceIncludedInAnyPackage(serviceId)) {
        const service = Object.values(categories)
          .flatMap((category) => category.services)
          .find((srv) => srv.id === serviceId);
  
        if (service) {
          total += service.pricing[selectedFrequency];
        }
      }
    });
  
    return total;
  }
  
  
  
  

  
  
  const handleSubmit = async () => {
    // Validate form inputs
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert("All fields are required. Please fill out your name, email, and phone.");
      return;
    }
  
    // Prepare the data to be submitted
    const data = {
      category: activeCategory,
      frequency: selectedFrequency,
      services: JSON.stringify(selectedServices),
      packages: JSON.stringify(selectedPackages),
      total: computeTotal(),
      selected_date: selectedDate.toString(), // Include selected date from the calendar
      client_name: name,
      client_email: email,
      client_phone: phone,
      preferred_time: preferredTime, // Add preferred time
      alternate_time: alternateTime, // Add alternate time
    };
  
    try {
      // Submit data to Supabase
      const { error } = await supabase.from("quote_requests").insert([data]);
      if (error) {
        console.error("Error submitting quote request to Supabase:", error);
        alert("An error occurred while submitting your quote. Please try again.");
        return;
      }
  
      // Notify admin via email
      const adminResponse = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "service@sitedominion.com", // Replace with the admin's email
          subject: "New Quote Request Submitted",
          firstName: "Admin",
          details: data,
        }),
      });
  
      if (!adminResponse.ok) {
        const adminErrorData = await adminResponse.json();
        console.error("Error sending admin email:", adminErrorData);
        alert("An error occurred while sending the admin notification email.");
        return;
      }
  
      // Notify client via email
      const clientResponse = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Your Quote Request Confirmation",
          firstName: name,
          details: data,
        }),
      });
  
      if (!clientResponse.ok) {
        const clientErrorData = await clientResponse.json();
        console.error("Error sending client email:", clientErrorData);
        alert("An error occurred while sending your confirmation email.");
        return;
      }
  
      // Success: Notify the user and reset form
      alert("Quote request submitted successfully! A confirmation email has been sent.");
      setSelectedServices([]);
      setSelectedPackages([]);
      setSelectedFrequency("weekly");
      setActiveCategory("lawncare");
      setSelectedDate(today(getLocalTimeZone())); // Reset selected date
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      alert("An unexpected error occurred while submitting your quote. Please try again.");
    }
  };
  
  
  

    const CustomRadio: React.FC<React.ComponentProps<typeof Radio>> = (props) => {
      const { children, ...otherProps } = props;


      
    
      return (
        <Radio
          {...otherProps}
          classNames={{
            base: cn(
              "flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between",
              "cursor-pointer rounded-full border-2 border-default-200/60",
              "data-[selected=true]:border-primary"
            ),
            label: "text-tiny text-default-500",
            labelWrapper: "px-1 m-0",
            wrapper: "hidden",
          }}
        >
          {children}
        </Radio>
      );
    };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
    <header className="p-6 border-b border-gray-300">
      <h1 className="text-3xl font-bold">Booking Page</h1>
      <p className="text-gray-600 mt-2">
        Select your category, frequency, and services to build your custom landscaping plan.
      </p>
    </header>
  
    <main className="flex-grow flex flex-col lg:flex-row p-6 gap-6">
      {/* LEFT: FORM */}
      <div className="w-full lg:w-2/3 space-y-8">
        {/* 1) Category Tabs */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Select a Category:</h2>
          <div className="flex space-x-4">
          {(["lawncare", "pressureWashing", "gardening", "dumpRuns"] as Category[]).map((category) => (
  <button
    key={category}
    className={`px-4 py-2 rounded-lg ${
      activeCategory === category
        ? "bg-green-600 text-white"
        : "bg-white text-gray-800 hover:bg-gray-300"
    }`}
    onClick={() => handleCategoryChange(category)}
  >
    {category === "lawncare"
      ? "Lawn Care"
      : category === "pressureWashing"
      ? "Pressure Washing"
       : category === "gardening"
      ? "Gardening"
      : "Dump Runs"}
  </button>
))}
          </div>
        </section>
  
        {/* 2) Frequency Selection */}
        <section>
  <h2 className="text-xl font-semibold mb-2">Select Frequency:</h2>
  <div className="flex space-x-4">
    {["weekly", "bi-weekly", "monthly", "one-time"].map((frequency) => (
      <button
        key={frequency}
        className={`px-4 py-2 rounded-lg ${
          selectedFrequency === frequency
            ? "bg-green-600 text-white"
            : "bg-white text-gray-800 hover:bg-gray-300"
        }`}
        onClick={() => handleFrequencyChange(frequency as Frequency)}
      >
        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
      </button>
    ))}
  </div>
</section>

  
 
       {/* 3) Services List */}
       <section>
  <h2 className="text-xl font-semibold mb-2">Available Packages:</h2>
  <div className="space-y-2">
  {categories[activeCategory].packages.map((pkg) => {
  const isChecked = selectedPackages.includes(pkg.id);

  return (
    <label key={pkg.id} className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => handlePackageToggle(pkg.id)}
      />
      <span>
        {pkg.name} (Discounted Price:{" "}
        <span className="text-green-600">${pkg.pricing[selectedFrequency]}</span>)
      </span>
    </label>
  );
})}

  </div>

  <h2 className="text-xl font-semibold mt-4 mb-2">Available Services:</h2>
  <div className="space-y-2">
  {categories[activeCategory].services.map((srv) => {
    const isIncludedInSelectedPackage = isServiceIncludedInAnyPackage(srv.id);

    return (
      <label
        key={srv.id}
        className={`flex items-center space-x-2 ${
          isIncludedInSelectedPackage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          checked={selectedServices.includes(srv.id)}
          disabled={isIncludedInSelectedPackage}
          onChange={() => handleServiceToggle(srv.id)}
        />
        <span>
          {srv.name}:{" "}
          <span className="text-green-600">
            {isIncludedInSelectedPackage ? "Included" : `$${srv.pricing[selectedFrequency]}`}
          </span>
        </span>
      </label>
    );
  })}
</div>



</section>




  
        {/* 4) Contact Information */}
        <section>
          <h2 className="text-xl font-semibold">Contact Information:</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded bg-white text-black"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded bg-white text-black"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone Number:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded bg-white text-black"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </section>
      </div>
  
      {/* RIGHT: SUMMARY */}
      <aside className="w-full lg:w-1/3 bg-black p-6 rounded-lg border border-gray-300 h-fit self-start sticky-summary">
  <h2 className="text-xl font-semibold mb-4">SUMMARY</h2>

  {/* Selected Frequency */}
  <p className="text-gray-600 mb-4">
    Frequency: <strong>{selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1)}</strong>
  </p>


 {/* Selected Packages */}
<div className="mb-4">
  <h3 className="text-lg font-semibold">Selected Packages:</h3>

  {selectedPackages.map((packageId) => {
    const pkg = Object.values(categories)
      .flatMap((category) => category.packages)
      .find((pkg) => pkg.id === packageId);

    return (
      pkg && (
        <div key={packageId}>
          <div className="flex justify-between">
            <span>{pkg.name}</span>
            <span className="text-green-600">${pkg.pricing[selectedFrequency]}</span>
          </div>
          <ul className="pl-6 text-gray-500 text-sm">
            {pkg.servicesIncluded.map((serviceId) => {
              const service = Object.values(categories)
                .flatMap((category) => category.services)
                .find((srv) => srv.id === serviceId);
              return (
                service && (
                  <li key={serviceId} className="italic">
                    {service.name} (Included)
                  </li>
                )
              );
            })}
          </ul>
        </div>
      )
    );
  })}

  {selectedPackages.length === 0 && <p className="text-gray-500">No packages selected.</p>}
</div>


  {/* Selected Services */}
  <div className="mb-4">
    <h3 className="text-lg font-semibold">Selected Services:</h3>
    {selectedServices
      .filter((serviceName) => !isServiceIncludedInAnyPackage(serviceName))
      .map((serviceId) => {
        const service = Object.values(categories)
          .flatMap((category) => category.services)
          .find((srv) => srv.id === serviceId);

        return (
          service && (
            <div key={serviceId} className="flex justify-between">
              <span>{service.name}</span>
              <span className="text-green-600">${service.pricing[selectedFrequency]}</span>
            </div>
          )
        );
      })}
    {selectedServices.length === 0 && <p className="text-gray-500">No services selected.</p>}
  </div>

  {/* Total */}
  <div className="flex justify-between border-t text-gray-800 border-gray-300 pt-2 text-lg font-bold">
    <span>Total:</span>
    <span>${computeTotal()}</span>
  </div>

  <section className="flex flex-col items-center justify-center">
    
  <h2 className="text-xl font-semibold">Select a Date:</h2>
  <div className="flex flex-row">
  <Calendar
    value={selectedDate}
    onChange={setSelectedDate}
    nextButtonProps={{ variant: "bordered" }}
    prevButtonProps={{ variant: "bordered" }}
    topContent={
<ButtonGroup>
  <Button onPress={() => setSelectedDate(today(getLocalTimeZone()))}>
    Today
  </Button>
  <Button onPress={() => setSelectedDate(startOfWeek(selectedDate, locale))}>
    Next Week
  </Button>
  <Button onPress={() => setSelectedDate(startOfMonth(selectedDate))}>
    Next Month
  </Button>
</ButtonGroup>

    }
  />

<div className="flex flex-col">
  {/* Preferred Time Input */}
  <div className="mt-4">
    <label className="block text-gray-700 font-medium mb-1">
      Preferred Time:
    </label>
    <input
      type="time"
      value={preferredTime}
      onChange={(e) => setPreferredTime(e.target.value)}
      className="w-full p-2 border rounded bg-white text-black"
    />
  </div>

  {/* Alternate Time Input */}
  <div className="mt-4">
    <label className="block text-gray-700 font-medium mb-1">
      Alternate Time:
    </label>
    <input
      type="time"
      value={alternateTime}
      onChange={(e) => setAlternateTime(e.target.value)}
      className="w-full p-2 border rounded bg-white text-black"
    />
  </div>
  </div>
  </div>
</section>


  {/* Submit Button */}
  <button
    className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded mt-4 text-white"
    onClick={handleSubmit}
  >
    Submit Quote
  </button>
</aside>



    </main>
  </div>
  
  );
}
