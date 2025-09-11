import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CheckIcon, SparklesIcon, StarIcon } from "lucide-react";

export function PriceSelect() {
  const plans = [
    {
      name: "One-time",
      description: "Pay once. Use once.",
      price: "$0.99",
      period: "per use",
      features: ["Single use access", "Basic features", "No commitment"],
      buttonText: "Buy Now",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Monthly",
      description: "Unlimited access for 1 month.",
      price: "$9.99",
      period: "month",
      originalPrice: "$19.99",
      savePercent: "50%",
      features: ["Unlimited access", "All features", "24/7 customer support", "Priority updates"],
      buttonText: "Subscribe Now",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "6 Months",
      description: "Best value for half-year access.",
      price: "$39.99",
      period: "6 months",
      originalPrice: "$59.99",
      savePercent: "33%",
      features: ["6 months unlimited access", "All premium features", "Dedicated support", "Free upgrades"],
      buttonText: "Subscribe",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground text-lg">
          Select the plan that&apos;s right for you. Cancel anytime.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name}
            className={`relative p-6 transition-all duration-300 hover:shadow-lg ${
              plan.popular 
                ? 'border-2 border-primary shadow-2xl scale-105 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950' 
                : 'hover:shadow-md hover:scale-102'
            }`}
          >
            {/* 热门标签 */}
            {plan.popular && (
              <>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 shadow-lg">
                    <SparklesIcon className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              </>
            )}

            {/* 节省标签 */}
            {plan.savePercent && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  Save {plan.savePercent}
                </Badge>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              
              <div className="mb-4">
                {plan.originalPrice && (
                  <div className="text-muted-foreground line-through text-sm mb-1">
                    {plan.originalPrice}
                  </div>
                )}
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-3xl ${plan.popular ? 'text-primary' : ''}`}>
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/ {plan.period}</span>
                </div>
              </div>
            </div>

            {/* 功能列表 */}
            <div className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* 按钮 */}
            <Button 
              variant={plan.buttonVariant}
              className={`w-full py-3 transition-all duration-300 ${
                plan.popular 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                  : 'hover:shadow-md'
              }`}
            >
              {plan.popular && <StarIcon className="w-4 h-4 mr-2" />}
              {plan.buttonText}
              {plan.popular && " 🚀"}
            </Button>

          </Card>
        ))}
      </div>

      {/* 底部信任信号 */}
      <div className="text-center mt-12">
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground mb-4">
          <CheckIcon className="w-4 h-4 text-green-500" />
          <span>Cancel anytime</span>
          <CheckIcon className="w-4 h-4 text-green-500" />
          <span>Secure payment</span>
          <CheckIcon className="w-4 h-4 text-green-500" />
          <span>24/7 support</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Trusted by over 10,000+ users worldwide
        </p>
      </div>
    </div>
  );
}