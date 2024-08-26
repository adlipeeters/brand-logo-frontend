import Image from "next/image";
import { Inter } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { GridLoader } from "react-spinners";

const FromUrl = () => {
    return (
        <div>from-url</div>
    )
}

export default FromUrl