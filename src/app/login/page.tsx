'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login(){
    const [email,setEmail]=useState<string>('');
    const [password,setPassword]=useState<string>('');
    const Router=useRouter();
    const validate=async(e: React.FormEvent)=>{
                e.preventDefault();
        try {
            const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            });
        
            if (!res.ok) {
            // Log the error response
            const errorData = await res.json();
            console.error('Error:', errorData.message);
            return;
            }
        
            const data = await res.json();
                alert("login successful");// Redirect to the dashboard page
                Router.push('/homepage');
            
        } catch (error) {
            // Handle network errors or unexpected exceptions
            console.error('Fetch error:');
        }

    }
    return(
        
        <div className="text-black h-screen w-full flex flex-col items-center justify-center " style={{backgroundImage: "url('/assets/background1.jpg')",backgroundSize: "cover"}}>
            
            <div id="logo"> 
                <a href="/"><img src="/assets/Logo.png" className="rounded-md shadow-lg"></img></a>
            </div>
            <br />
            <div className="border border-black p-10 rounded-lg w-120 h-90 shadow-lg" style={{backgroundColor:'#fff5ee'}}>
            <form onSubmit={validate}noValidate>
                <div className="flex flex-col">
                <label className="text-black text-left">Username:</label>
                <input type="email"
                className="border border-black rounded-md text-xl pt-2 pl-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                
                <label className="text-black text-left pt-10">Password:</label>
                <input type="password"
                className="border border-black rounded-md text-xl pt-2 pl-2"
                placeholder="Enter password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <div className="flex justify-center pt-4">
                <button className="text-white w-30 h-15 rounded-xl text-charcoal text-xl m-5 shadow-lg hover:scale-110 font-bold" style={{backgroundColor:'#FF7F50  '}}
                 type="submit">Login</button>
                
                </div>
                </div>
        </form>
            </div>
        </div>
    );

}