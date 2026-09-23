import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { CheckCircle, Star, Clock, Shield, Headphones, Quote, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/hooks/use-scroll-animation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { EXTERNAL_URLS, CONTACT_INFO } from "@/lib/external-urls";

const AgendarDemo = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Clock,
      title: t("agendarDemo.benefits.personalizedDemo.title"),
      description: t("agendarDemo.benefits.personalizedDemo.description")
    },
    {
      icon: Shield,
      title: t("agendarDemo.benefits.noCommitment.title"),
      description: t("agendarDemo.benefits.noCommitment.description")
    },
    {
      icon: Headphones,
      title: t("agendarDemo.benefits.seeAiInAction.title"),
      description: t("agendarDemo.benefits.seeAiInAction.description")
    }
  ];

  const testimonials = [
    {
      name: "Michael Miller",
      company: "Miller HVAC & Heating Pros",
      location: "Houston, TX",
      text: t("agendarDemo.testimonials.michael"),
      rating: 5,
    },
    {
      name: "Mateo Rodriguez",
      company: "Rodriguez Plumbing Services",
      location: "Phoenix, AZ",
      text: t("agendarDemo.testimonials.mateo"),
      rating: 5,
    },
    {
      name: "Carlos Mendes",
      company: "Mendes Premier Cleaning LLC",
      location: "Miami, FL",
      text: t("agendarDemo.testimonials.carlos"),
      rating: 5,
    },
    {
      name: "David Richardson",
      company: "Apex Roofing & Construction LLC",
      location: "Atlanta, GA",
      text: t("agendarDemo.testimonials.david"),
      rating: 5,
    },
  ];

  const quickBenefits = [
    t("agendarDemo.quickBenefits.demo30min"),
    t("agendarDemo.quickBenefits.free"),
    t("agendarDemo.quickBenefits.noCommitment")
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: t("footer.contact"),
      value: CONTACT_INFO.PHONE,
      href: CONTACT_INFO.PHONE_HREF
    },
    {
      icon: Mail,
      label: "Email",
      value: CONTACT_INFO.EMAIL,
      href: `mailto:${CONTACT_INFO.EMAIL}`
    },
    {
      icon: MapPin,
      label: t("contact.location") || "Location",
      value: CONTACT_INFO.LOCATION,
      href: null
    }
  ];

  return (
    <Layout>
      <SEO titleKey="seo.bookDemo.title" descriptionKey="seo.bookDemo.description" />
      {/* Hero Section with Contact Info */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/30 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container max-w-4xl relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                {t("agendarDemo.hero.badge")}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {t("agendarDemo.hero.title")} <span className="text-primary">{t("agendarDemo.hero.titleHighlight")}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("agendarDemo.hero.subtitle")}
              </p>
            </div>
          </AnimatedSection>

          {/* Flex container for mobile reordering */}
          <div className="flex flex-col">
            {/* Main CTA Button - first on mobile, second on desktop */}
            <AnimatedSection animation="fade-up" delay={100} className="order-1 md:order-2">
              <div className="flex justify-center mb-10">
                <Button asChild size="lg" className="h-16 px-16 text-lg tracking-wide">
                  <a 
                    href={EXTERNAL_URLS.GHL_BOOKING}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    {t("agendarDemo.ctaButton")}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </AnimatedSection>

            {/* Quick Benefits - second on mobile, third on desktop */}
            <AnimatedSection animation="fade-up" delay={150} className="order-2 md:order-3">
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                {quickBenefits.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Contact Info Cards - third on mobile, first on desktop */}
            <AnimatedSection animation="scale" delay={200} className="order-3 md:order-1">
              <div className="grid md:grid-cols-3 gap-4 mb-10">
                {contactInfo.map((item, index) => (
                  <div key={index} className="bg-card p-6 rounded-xl border border-border text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    {item.href ? (
                      <a 
                        href={item.href} 
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-foreground">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              {t("agendarDemo.benefitsSection.title")}
            </h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {t("agendarDemo.testimonialsSection.badge")}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("agendarDemo.testimonialsSection.title")}
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <div className="relative flex-1">
                    <Quote className="absolute -top-2 -left-1 h-6 w-6 text-primary/20" />
                    <p className="text-muted-foreground pl-4 italic">
                      {testimonial.text}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container">
          <AnimatedSection animation="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
                <p className="text-primary-foreground/80 text-sm">{t("agendarDemo.stats.companiesServed")}</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">1M+</div>
                <p className="text-primary-foreground/80 text-sm">{t("agendarDemo.stats.callsAutomated")}</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">98%</div>
                <p className="text-primary-foreground/80 text-sm">{t("agendarDemo.stats.satisfaction")}</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1">24/7</div>
                <p className="text-primary-foreground/80 text-sm">{t("agendarDemo.stats.activeSupport")}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default AgendarDemo;
