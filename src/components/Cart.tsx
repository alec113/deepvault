import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import emailjs from "@emailjs/browser";

import { useStore } from "../context/StoreContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus, X, Copy, Edit } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [bankDetails, setBankDetails] = useState({});
  const [btcAddress, setBtcAddress] = useState<string>("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    phoneNumber: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const BIN_ID = "67b4ff60acd3cb34a8e75b63";
  const API_KEY =
    "$2a$10$LoUE3DG23v0idSgqUwPW2ezaM2GPu/HLJAnxJAxZeua0QbYLu54wK";

  // Load user details from localStorage on component mount
  useEffect(() => {
    const savedDetails = localStorage.getItem("userDeliveryDetails");
    if (savedDetails) {
      try {
        const parsedDetails = JSON.parse(savedDetails);
        setUserDetails(parsedDetails);
      } catch (error) {
        console.error("Failed to parse saved user details:", error);
      }
    }
  }, []);

  // Save user details to localStorage whenever they change
  useEffect(() => {
    if (userDetails.phoneNumber || userDetails.address) {
      localStorage.setItem("userDeliveryDetails", JSON.stringify(userDetails));
    }
  }, [userDetails]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const handleUserDetailsSubmit = () => {
    if (!userDetails.phoneNumber || !userDetails.address) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Details will be automatically saved to localStorage via the useEffect
    toast.success("Delivery details saved");
    setShowDetailsModal(false);
  };

  const handleOrderSubmit = async () => {
    setIsSubmitting(true);

    const cartItemsList = cart
      .map(
        (item) =>
          `- ${item.name} (x${item.quantity}) - $${item.price.toLocaleString()}`
      )
      .join("\n");

    const orderDetails = {
      payment_method: paymentMethod,
      total_amount: `$${cartTotal.toLocaleString()}`,
      customer_phone: userDetails.phoneNumber,
      delivery_address: userDetails.address,
      message: cartItemsList,
      subject: `New Order - $${cartTotal.toLocaleString()} - ${
        userDetails.phoneNumber
      }`,
    };

    try {
      const result = await emailjs.send(
        "service_oc53umj",
        "template_7y1sqrg", 
        orderDetails,
        "fZbCubmPKBHtcOwoo" 
      );

      if (result.status === 200) {
        // Clear the cart
        clearCart();
        
        // Close the cart
        // setIsCartOpen(false);
        
        // Reset payment method
        setPaymentMethod(null);
        
        // Show success message
        toast.success("Order confirmed! We'll contact you shortly.", {
          duration: 5000, // Show for 5 seconds
          position: "top-center"
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Email sending failed:", error);
      toast.error("Failed to send order details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    axios
      .get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        headers: { "X-Master-Key": API_KEY },
      })
      .then((res) => {
        setBankDetails(res.data.record[0].bank_details);
        setBtcAddress(res.data.record[0].btc_address);
      })
      .catch((err) => {
        toast.error("Error fetching data");
        console.error("Error fetching data:", err);
      });
  }, []);

  const hasUserDetails = userDetails.phoneNumber && userDetails.address;

  return (
    <>
    <Toaster />
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild>
          <button 
            className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-transform hover:scale-105"
            onClick={() => setIsCartOpen(true)}
          >
            <div className="relative">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cart.length}
                </span>
              )}
            </div>
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <div className="flex h-full flex-col">
            <h2 className="text-2xl font-semibold">Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 py-4">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 rounded-lg border p-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            ${item.price.toLocaleString()}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(0, item.quantity - 1)
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* User Details Section */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Delivery Details</h3>
                    {hasUserDetails ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                          <div className="overflow-hidden">
                            <span className="text-sm font-medium">Phone:</span>
                            <p className="truncate">{userDetails.phoneNumber}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setShowDetailsModal(true)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                          <div className="overflow-hidden flex-1">
                            <span className="text-sm font-medium">Address:</span>
                            <p className="truncate">{userDetails.address}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setShowDetailsModal(true)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => setShowDetailsModal(true)}
                      >
                        Set Delivery Details
                      </Button>
                    )}
                  </div>

                  {/* Payment Method Section - Only shown if user details are set */}
                  {hasUserDetails && (
                    <div>
                      {paymentMethod ? (
                        <div>
                          {paymentMethod === "Bank Transfer" && (
                            <div className="space-y-2">
                              <h3 className="text-lg font-medium">Bank Details</h3>
                              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                <span>{bankDetails?.account_number}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    handleCopy(bankDetails.account_number)
                                  }
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                <span>{bankDetails?.bank_name}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleCopy(bankDetails?.bank_name)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                          {paymentMethod === "BTC" && (
                            <div className="space-y-2">
                              <h3 className="text-lg font-medium">
                                Bitcoin Address
                              </h3>
                              <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                <span className="truncate">{btcAddress}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleCopy(btcAddress)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                          <Button
                            className="w-full mt-4 bg-green-600 text-white hover:bg-green-500"
                            onClick={handleOrderSubmit}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Processing..." : "I have made this payment"}
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => setPaymentMethod(null)}
                          >
                            Change Payment Method
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium">
                            Choose Payment Method
                          </h3>
                          <RadioGroup
                            onValueChange={setPaymentMethod}
                            className="mt-2 space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="BTC"
                                id="btc"
                              />
                              <Label htmlFor="btc">Bitcoin (BTC)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="Bank Transfer"
                                id="bank"
                              />
                              <Label htmlFor="bank">Bank Transfer</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={userDetails.phoneNumber}
                onChange={(e) =>
                  setUserDetails((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                value={userDetails.address}
                onChange={(e) =>
                  setUserDetails((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Enter your delivery address"
                rows={3}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleUserDetailsSubmit}
            >
              Save Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )}