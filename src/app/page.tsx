import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { CheckCircle2, ArrowRight, Users, FileText, Calendar, Zap, Shield, Star, Mail, Phone, MapPin, BarChart3, TrendingUp, MessageSquare, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-200/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Navigation - Transparent */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-orange-50/80 border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <div className="flex items-center space-x-4">
              <Link href="/leads">
                <Button variant="ghost" className="text-gray-700 hover:text-sky-600">
                  Logga in
                </Button>
              </Link>
              <Link href="/leads">
                <Button className="bg-gradient-to-r from-sky-500 to-teal-600 hover:from-sky-600 hover:to-teal-700 text-white">
                  Starta gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - More dynamic */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Sluta jaga kunder.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600">
                  Låt dem komma till dig.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Ticko automatiserar det tråkiga så du kan fokusera på det roliga. Att stänga affärer och växa ditt företag.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/leads">
                  <Button size="lg" className="bg-gradient-to-r from-sky-500 to-teal-600 hover:from-sky-600 hover:to-teal-700 text-white text-lg px-8 py-3">
                    Börja idag – gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                  Se hur det funkar
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Inget kreditkort</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Konfigurera på 2 min</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-teal-400/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-sky-100 dark:border-sky-800/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Live dashboard</h3>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Live</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Nya leads idag</span>
                    </div>
                    <span className="text-lg font-bold text-sky-600 dark:text-sky-400">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Konverteringsgrad</span>
                    </div>
                    <span className="text-lg font-bold text-teal-600 dark:text-teal-400">24%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Uppföljningar</span>
                    </div>
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Unique horizontal scroll */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 dark:text-sky-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Svenska företag</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">89%</div>
              <div className="text-gray-600 dark:text-gray-300">Mer effektiva</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">15h</div>
              <div className="text-gray-600 dark:text-gray-300">Sparad tid/vecka</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">4.9★</div>
              <div className="text-gray-600 dark:text-gray-300">Användarbetyg</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Timeline instead of boxes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Så enkelt är det
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Från noll till första kunden på under en timme
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 to-teal-600"></div>
            
            <div className="space-y-12">
              <div className="relative flex items-start gap-8">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  1
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-sky-100 dark:border-sky-800/30">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Importera dina leads</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ladda upp en CSV-fil med dina befintliga kontakter eller hitta nya via vår AI-drivna enrichment.
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-start gap-8">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  2
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-teal-100 dark:border-teal-800/30">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Skapa personliga offerter</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Använd våra mallar för att snabbt skapa professionella offerter som imponerar på dina kunder.
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-start gap-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  3
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-amber-100 dark:border-amber-800/30">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Följ upp automatiskt</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Få smarta påminnelser när det är dags att höra av dig. Aldrig mer missade affärsmöjligheter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature showcase - Interactive demo style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Rätt verktyg. Inget mer.
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Inga onödiga funktioner. Bara det du behöver för att sälja mer och växa ditt företag.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart lead-hantering</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Importera, enricha och organisera dina leads utan krångel. AI hjälper dig hitta rätt kontaktinformation.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Offertbyggaren</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Skapa snygga offerter på minuter med våra professionella mallar. Skicka direkt från systemet.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI-assistenter</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Få hjälp att skriva mejl, analysera leads och optimera din säljprocess med smart AI.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 to-teal-400/10 rounded-3xl transform -rotate-2"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-sky-100 dark:border-sky-800/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center text-sm text-gray-500 dark:text-gray-400">ticko.se/leads</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-sky-200 dark:bg-sky-800 rounded"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">ByggPro AB</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Stockholm</div>
                      </div>
                    </div>
                    <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Ny</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-teal-200 dark:bg-teal-800 rounded"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">DesignStudio</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Göteborg</div>
                      </div>
                    </div>
                    <Badge className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Kontakt</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-amber-200 dark:bg-amber-800 rounded"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">VVS-Sverige</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Malmö</div>
                      </div>
                    </div>
                    <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Offert</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white flex-1">
                      <Users className="h-3 w-3 mr-1" />
                      Leads
                    </Button>
                    <Button size="sm" variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                      <FileText className="h-3 w-3 mr-1" />
                      Offert
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Simplified */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Enkel prissättning
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Börja gratis, väx när du behöver
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Gratis</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">0 kr<span className="text-lg font-normal text-gray-600 dark:text-gray-300">/månad</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                  50 leads
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                  10 offerter/månad
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                  Basic support
                </li>
              </ul>
              <Link href="/leads">
                <Button className="w-full" variant="outline">
                  Börja gratis
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-sky-500 to-teal-600 p-8 rounded-2xl shadow-xl text-white relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-sky-600 border-white">
                Mest populär
              </Badge>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">299 kr<span className="text-lg font-normal text-sky-100">/månad</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-white mr-3" />
                  Obegränsat med leads
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-white mr-3" />
                  Obegränsade offerter
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-white mr-3" />
                  AI-enrichment
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-white mr-3" />
                  Prioriterad support
                </li>
              </ul>
              <Link href="/leads">
                <Button className="w-full bg-white text-sky-600 hover:bg-sky-50">
                  Välj Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - More compelling */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Redo att dubbla din försäljning?
          </h2>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Gå med 500+ svenska företag som redan sparat timmar varje vecka med Ticko. 
            Börja gratis idag – ingen bindningstid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/leads">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50 text-lg px-8 py-3">
                Starta gratis provperiod
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white/10">
              Boka 15-min demo
            </Button>
          </div>
          <p className="text-sky-100 text-sm mt-6">
            ✨ Ingen kreditkort krävs • Konfigurera på 2 minuter • Avsluta när du vill
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
              <Logo size="lg" dark />
              <p className="text-sm mt-4 text-gray-300">
                Smart säljautomation för svenska småföretagare
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/leads" className="hover:text-sky-400">Leads</Link></li>
                <li><Link href="/offerter" className="hover:text-sky-400">Offerter</Link></li>
                <li><Link href="/idag" className="hover:text-sky-400">Uppföljning</Link></li>
                <li><a href="#" className="hover:text-sky-400">Priser</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400">Hjälpcenter</a></li>
                <li><a href="#" className="hover:text-sky-400">API-dokumentation</a></li>
                <li><a href="#" className="hover:text-sky-400">Kontakta oss</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Företag</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-sky-400">Om oss</a></li>
                <li><a href="#" className="hover:text-sky-400">Blogg</a></li>
                <li><a href="#" className="hover:text-sky-400">Karriär</a></li>
                <li><a href="#" className="hover:text-sky-400">Integritet</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              © 2024 Ticko.se. Alla rättigheter reserverade.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hej@ticko.se</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>08-123 456 78</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Stockholm, Sverige</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
