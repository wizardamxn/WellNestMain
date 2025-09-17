import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, User, Globe } from "lucide-react";
import { useUser } from "../hooks/useUserData";

export default function Navbar() {
  const [language, setLanguage] = useState("english");
  const { user, isLoggedIn } = useUser();
  const [, setLocation] = useLocation();

  return (
    <>
      <nav
        data-testid="navbar"
        className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-md border-b border-border z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              data-testid="link-home"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                WellNest
              </span>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  data-testid="select-language"
                  className="w-auto border-none bg-transparent text-sm"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी</SelectItem>
                  <SelectItem value="tamil">தமிழ்</SelectItem>
                  <SelectItem value="bengali">বাংলা</SelectItem>
                </SelectContent>
              </Select>

              {/* Profile Button */}
              {isLoggedIn ? (
                <Button
                  data-testid="button-profile"
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 bg-primary/10 hover:bg-primary/20"
                  onClick={() => setLocation("/student")}
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.preferredName
                        ? user.preferredName[0].toUpperCase()
                        : user?.username[0].toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.preferredName || "Profile"}
                  </span>
                </Button>
              ) : (
                <Button
                  data-testid="button-login"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // For demo purposes, auto-login a demo user
                    // In production, this would redirect to a proper login flow
                    window.location.href = "/dashboard";
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Emergency Support Banner (shows when high risk detected) */}
      <div
        className="fixed top-16 left-0 right-0 bg-destructive text-destructive-foreground p-3 text-center text-sm z-40 hidden"
        id="emergency-banner"
      >
        <div className="flex items-center justify-center space-x-4">
          <span>🚨 We're here to help. Crisis support is available 24/7.</span>
          <Button size="sm" variant="secondary" data-testid="button-emergency">
            Get Help Now
          </Button>
        </div>
      </div>
    </>
  );
}
