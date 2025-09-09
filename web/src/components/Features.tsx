import { Camera, Upload, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";

export function Features() {
  const steps = [
    {
      number: "01",
      title: "Take a photo",
      description: "Capture your current makeup look with your phone or camera.",
      icon: Camera,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      darkBgColor: "dark:bg-blue-950/30"
    },
    {
      number: "02", 
      title: "Upload",
      description: "Use our tool to upload the photo (mobile-friendly & quick).",
      icon: Upload,
      color: "text-green-500",
      bgColor: "bg-green-50",
      darkBgColor: "dark:bg-green-950/30"
    },
    {
      number: "03",
      title: "Get results",
      description: "Wait a moment while we analyze and display your insights.",
      icon: Sparkles,
      color: "text-purple-500", 
      bgColor: "bg-purple-50",
      darkBgColor: "dark:bg-purple-950/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your makeup analysis experience in just three simple steps
          </p>
        </div>

        {/* Steps Flow */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                {/* Step Card */}
                <Card className={`w-full p-6 border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl group ${step.bgColor} ${step.darkBgColor}`}>
                  <div className="flex flex-col items-center text-center gap-6">
                    {/* Step Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className={`relative w-20 h-20 rounded-2xl ${step.color} bg-white dark:bg-background shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <step.icon className="w-8 h-8" />
                        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold`}>
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">
                        {step.title}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Arrow Between Steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex justify-center mx-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-200">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}