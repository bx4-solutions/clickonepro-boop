import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { AnimatedSection } from "@/hooks/use-scroll-animation";
import AudioTranscriptPlayer from "@/components/AudioTranscriptPlayer";
import { audioDemos } from "@/data/audioDemo";
import {
  Phone,
  MessageSquare,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Bot,
  Headphones,
  Star,
} from "lucide-react";
// Hero images served from public folder for preload matching
import mobileApp from "@/assets/mobile-app-clickone.jpg";
import mobileAppWebp from "@/assets/mobile-app-clickone.webp";
import industryCleaning from "@/assets/industry-cleaning.jpg";
import industryCleaningWebp from "@/assets/industry-cleaning.webp";
import industryConstruction from "@/assets/industry-construction.jpg";
import industryConstructionWebp from "@/assets/industry-construction.webp";
import industryHvac from "@/assets/industry-hvac.jpg";
import industryHvacWebp from "@/assets/industry-hvac.webp";
import industryPlumbing from "@/assets/industry-plumbing-new.jpg";
import industryPlumbingWebp from "@/assets/industry-plumbing-new.webp";
import industryElectrical from "@/assets/industry-electrical.jpg";
import industryElectricalWebp from "@/assets/industry-electrical.webp";
import industryLandscaping from "@/assets/industry-landscaping.jpg";
import industryLandscapingWebp from "@/assets/industry-landscaping.webp";
import logoClutch from "@/assets/logo-clutch.svg";
import logoG2 from "@/assets/logo-g2.svg";
import logoCapterra from "@/assets/logo-capterra.svg";
import logoTrustpilot from "@/assets/logo-trustpilot.svg";

// New High-Conversion & GEO Components
import { GEOFAQSection, getFAQItems } from "@/components/GEOFAQSection";
import { AfterHoursEmergencySection } from "@/components/AfterHoursEmergencySection";
import { MissedCallsCalculator } from "@/components/MissedCallsCalculator";

const Index = () => {
  const { t } = useTranslation();
  const [selectedDemo, setSelectedDemo] = useState(audioDemos[0]);

  const industries = [
    { name: t("industries.cleaning"), slug: "limpeza", image: industryCleaning, webp: industryCleaningWebp },
    { name: t("industries.construction"), slug: "construcao", image: industryConstruction, webp: industryConstructionWebp },
    { name: t("industries.hvac"), slug: "hvac", image: industryHvac, webp: industryHvacWebp },
    { name: t("industries.plumbing"), slug: "encanamento", image: industryPlumbing, webp: industryPlumbingWebp },
    { name: t("industries.electrical"), slug: "eletrica", image: industryElectrical, webp: industryElectricalWebp },
    { name: t("industries.landscaping"), slug: "paisagismo", image: industryLandscaping, webp: industryLandscapingWebp },
  ];

  const features = [
    {
      icon: Clock,
      title: t("features.feature1Title"),
      description: t("features.feature1Desc"),
    },
    {
      icon: Calendar,
      title: t("features.feature2Title"),
      description: t("features.feature2Desc"),
    },
    {
      icon: Users,
      title: t("features.feature3Title"),
      description: t("features.feature3Desc"),
    },
    {
      icon: TrendingUp,
      title: t("features.feature4Title"),
      description: t("features.feature4Desc"),
    },
  ];

  const channels = [
    { name: t("omnichannel.phone"), icon: Phone },
    { name: t("omnichannel.sms"), icon: MessageSquare },
    { name: t("omnichannel.whatsapp"), icon: Smartphone },
    { name: "Instagram", icon: MessageSquare },
    { name: "Facebook", icon: MessageSquare },
    { name: t("omnichannel.webchat"), icon: Bot },
  ];

  const steps = [
    {
      number: "01",
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
    },
    {
      number: "02",
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
    },
    {
      number: "03",
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
    },
    {
      number: "04",
      title: t("howItWorks.step4Title"),
      description: t("howItWorks.step4Desc"),
    },
  ];

  const faqItems = getFAQItems(t);

  return (
    <Layout>
      <SEO 
        titleKey="seo.home.title" 
        descriptionKey="seo.home.description" 
        schemaType="SoftwareApplication"
        schemaData={{
          productName: "ClickOne AI — Virtual Receptionist for Service Businesses",
          productDescription: t("seo.home.description"),
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web, iOS, Android",
          offers: {
            price: "0",
            priceCurrency: "USD"
          }
        }}
        additionalSchemas={[
          {
            type: "FAQPage",
            data: {
              faqItems: faqItems
            }
          }
        ]}
      />
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden py-16 md:py-40 min-h-[90vh] flex items-center">
        {/* Background Image with Gradient Overlay - LCP Priority with Responsive srcset */}
        {/* Using public paths to match preload in index.html */}
        <picture className="absolute inset-0 w-full h-full">
          <source 
            type="image/webp"
            srcSet="/assets/hero-home-sm.webp 896w, /assets/hero-home-md.webp 1024w, /assets/hero-home-optimized.webp 1920w"
            sizes="100vw"
          />
          <img 
            src="/assets/hero-home.jpg"
            alt={t("seo.home.heroAlt")}
            width={1920}
            height={1080}
            fetchpriority="high"
            decoding="sync"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 via-foreground/85 to-primary/40" />
        
        {/* Floating Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-8 -mt-8 md:-mt-12 animate-fade-in">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-primary-foreground/90 font-medium">{t("hero.badge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-background leading-tight">
              {t("hero.title1")}{" "}
              <span className="relative inline-block">
                <span className="text-white font-extrabold [text-shadow:0_0_30px_hsl(var(--primary)),0_0_60px_hsl(var(--primary)/0.5)]">
                  {t("hero.title2")}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-white rounded-full shadow-[0_0_20px_hsl(var(--primary))]" />
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-background/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group text-base px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
                <Link to="/agendar-demo">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-6 bg-background/10 border-background/30 text-background hover:bg-background/20 hover:border-background/50 backdrop-blur-sm" asChild>
                <Link to="/setores">{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-background/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">{t("hero.trust1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">{t("hero.trust2")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">{t("hero.trust3")}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Social Proof Ratings - Animated Marquee */}
      <section className="bg-foreground py-6 border-y border-border/20 overflow-hidden">
        <div className="relative">
          {/* Gradient masks for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-foreground to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-foreground to-transparent z-10" />
          
          {/* Scrolling container */}
          <div className="flex animate-marquee">
            {/* First set of items */}
            <div className="flex items-center gap-12 md:gap-16 lg:gap-20 shrink-0 px-8">
              {/* Clutch */}
              <div className="flex items-center gap-3">
                <span className="text-background/90 font-bold text-lg">4.8</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <img src={logoClutch} alt="Clutch" className="h-7" />
              </div>
              
              {/* G2 */}
              <div className="flex items-center gap-3">
                <span className="text-background/90 font-bold text-lg">4.9</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <img src={logoG2} alt="G2" className="h-7" />
              </div>
              
              {/* Capterra */}
              <div className="flex items-center gap-3">
                <span className="text-background/90 font-bold text-lg">4.8</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <img src={logoCapterra} alt="Capterra" className="h-7" />
              </div>
              
              {/* Trustpilot */}
              <div className="flex items-center gap-3">
                <span className="text-background/90 font-bold text-lg">4.3</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'fill-green-500 text-green-500' : 'fill-green-500/30 text-green-500/30'}`} />
                  ))}
                </div>
                <img src={logoTrustpilot} alt="Trustpilot" className="h-7" />
              </div>
            </div>

            {/* Duplicate set for seamless loop */}
            <div className="flex items-center gap-12 md:gap-16 lg:gap-20 shrink-0 px-8">
              {/* Clutch */}
              <div className="flex items-center gap-3">
                <span className="text-background/90 font-bold text-lg">4.8</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <img src={logoClutch} alt="Clutch" className="h-7" />
              </div>
              
              {/* G2 */}
              <div className="flex items-center gap-3">
                <span className="text-background/90 font-bold text-lg">4.9</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <img src={logoG2} alt="G2" className="h-7" />
              </div>
              
              {/* Capterra */}
              <div className="flex items-center gap-3">
                <span className="text-background/90 font-bold text-lg">4.8</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <img src={logoCapterra} alt="Capterra" className="h-7" />
              </div>
              
              {/* Trustpilot */}
              <div className="flex items-center gap-3">
                <span className="text-background/90 font-bold text-lg">4.3</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'fill-green-500 text-green-500' : 'fill-green-500/30 text-green-500/30'}`} />
                  ))}
                </div>
                <img src={logoTrustpilot} alt="Trustpilot" className="h-7" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Demo Section */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.05),transparent_50%)]" />
        
        <div className="container relative">
          <AnimatedSection className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Headphones className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("audioDemo.badge")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("audioDemo.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("audioDemo.subtitle")}
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={100}>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {audioDemos.map((demo) => (
                <Button
                  key={demo.id}
                  variant={selectedDemo.id === demo.id ? "default" : "outline"}
                  onClick={() => setSelectedDemo(demo)}
                  className="rounded-full px-6"
                >
                  {demo.title}
                </Button>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="max-w-4xl mx-auto">
              <AudioTranscriptPlayer demo={selectedDemo} />
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300} className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              {t("audioDemo.impressed")}
            </p>
            <Button asChild>
              <Link to="/agendar-demo">
                {t("audioDemo.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
      {/* Problem & Solution - Enhanced */}
      <section className="py-20 md:py-32 bg-background relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.05),transparent_50%)]" />
        
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
            {/* Problem Card */}
            <AnimatedSection animation="fade-left">
              <div className="group relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-destructive/20 to-destructive/5 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-card rounded-2xl p-8 md:p-10 border border-border/50 h-full">
                <div className="inline-flex items-center gap-2 text-destructive text-sm font-semibold mb-6 uppercase tracking-wide">
                  <span className="w-8 h-[2px] bg-destructive" />
                  {t("problem.label")}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 leading-tight">
                  <span className="whitespace-nowrap">{t("problem.title")}</span> = <span className="text-destructive whitespace-nowrap">{t("problem.titleHighlight")}</span>
                </h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4 group/item">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-sm">✗</span>
                    <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                      <strong className="text-foreground">62%</strong> {t("problem.stat1")}
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-sm">✗</span>
                    <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                      <strong className="text-foreground">85%</strong> {t("problem.stat2")}
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-sm">✗</span>
                    <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                      {t("problem.stat3")} <strong className="text-foreground">{t("problem.stat3Bold")}</strong> {t("problem.stat3End")}
                    </span>
                  </li>
                </ul>
              </div>
              </div>
            </AnimatedSection>
            
            {/* Solution Card */}
            <AnimatedSection animation="fade-right" delay={200}>
              <div className="group relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-10 border border-primary/20 h-full">
                <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-6 uppercase tracking-wide">
                  <span className="w-8 h-[2px] bg-primary" />
                  {t("solution.label")}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                  {t("solution.title")} <br />
                  <span className="text-primary">{t("solution.titleHighlight")}</span>
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4 group/item">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-foreground group-hover/item:text-primary transition-colors">
                      {t("solution.benefit1")} <strong>{t("solution.benefit1Bold")}</strong>{t("solution.benefit1End")}
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-foreground group-hover/item:text-primary transition-colors">
                      <strong>{t("solution.benefit2Bold")}</strong> {t("solution.benefit2End")}
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-foreground group-hover/item:text-primary transition-colors">
                      {t("solution.benefit3")} <strong>{t("solution.benefit3Bold")}</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group/item">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-foreground group-hover/item:text-primary transition-colors">
                      {t("solution.benefit4")} <strong>{t("solution.benefit4Bold")}</strong>
                    </span>
                  </li>
                </ul>
                
                {/* CTA inside solution */}
                <div className="mt-8 pt-6 border-t border-primary/20">
                  <Button className="w-full group" asChild>
                    <Link to="/agendar-demo">
                      {t("solution.cta")}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Interactive Missed Calls ROI Calculator */}
      <MissedCallsCalculator />

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("howItWorks.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("howItWorks.subtitle")}
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <Card className="relative overflow-hidden h-full">
                  <CardContent className="pt-6">
                    <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("features.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={index} animation="scale" delay={index * 100}>
                <Card className="text-center h-full">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Omnichannel */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("omnichannel.title")}
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              {t("omnichannel.subtitle")}
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {channels.map((channel, index) => (
                <div
                  key={index}
                  className="bg-primary-foreground/10 rounded-lg p-4 text-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <channel.icon className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">{channel.name}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 24/7 After-Hours & Emergency Routing Section */}
      <AfterHoursEmergencySection />

      {/* Mobile App */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t("mobileApp.title")}
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                {t("mobileApp.subtitle")}
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{t("mobileApp.feature1")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{t("mobileApp.feature2")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{t("mobileApp.feature3")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{t("mobileApp.feature4")}</span>
                </li>
              </ul>
              <Button asChild>
                <Link to="/agendar-demo">{t("mobileApp.cta")}</Link>
              </Button>
            </AnimatedSection>
            <AnimatedSection animation="fade-right" delay={200}>
              <div className="relative rounded-2xl overflow-hidden">
                <picture>
                  <source srcSet={mobileAppWebp} type="image/webp" />
                  <img 
                    src={mobileApp} 
                    alt="Aplicativo mobile ClickOne AI mostrando notificações e agenda" 
                    className="w-full h-auto rounded-2xl"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Industries Preview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("industries.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("industries.subtitle")}
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <Link to={`/setores/${industry.slug}`}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <picture>
                        {industry.webp && <source srcSet={industry.webp} type="image/webp" />}
                        <img 
                          src={industry.image} 
                          alt={industry.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="text-lg font-semibold">{industry.name}</h3>
                      <span className="text-sm text-primary">{t("industries.learnMore")}</span>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/setores">{t("industries.viewAll")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* GEO Structured FAQ Section (Google AI Overviews & Search Engine Optimization) */}
      <GEOFAQSection />

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("finalCta.title")}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            {t("finalCta.subtitle")}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/agendar-demo">
              {t("finalCta.cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
