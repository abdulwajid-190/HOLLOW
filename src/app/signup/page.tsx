'use client';
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
export default function Signup(){
        const [email,setEmail]=useState<string>('');
        const [show,setShow]=useState(false);
        const [password,setPassword]=useState<string>('');
        const [confirmPass,setConPassword]=useState<string>('');
        const Router=useRouter();
        const validate=async(e: React.FormEvent)=>{
            e.preventDefault();
            if(password!==confirmPass){
                console.error("password not matching");
                return;
            }
            try {
                const res = await fetch('/api/signup', {
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
                console.log('User created successfully:', data);
                Router.push('/login');
              } catch (error) {
                // Handle network errors or unexpected exceptions
                console.error('Fetch error:');
              }
          
        }
    return(
        
        <div className="text-black h-screen w-full flex flex-col items-center justify-center " style={{backgroundImage: "url('/assets/background1.jpg')",backgroundSize: "cover"}}>
            
            <div id="logo"> 
                <a href="/"><img src="/assets/Logo.png" className=""></img></a>
                
            </div>

            <div className="border border-black p-10 rounded-lg bg-gray-200 w-120 h-120">
            <form onSubmit={validate}noValidate>
                <div className="flex flex-col">
                <label className="text-black text-left ">Username:</label>
                <input type="email"
                className="border border-black rounded-md text-xl pt-2 pl-2 hover:border-3 border-black"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                
                <label className="text-black text-left pt-10">Password:</label>
                <div className="border border-black rounded-md hover:border-3 border-black">
                <input type={show? 'text':'password'}
                className=" text-xl pt-2 pl-2 w-90 hover:border-none outline-none shadow-none"
                placeholder="Enter password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <input
                type="checkBox"
                checked={show}
                className="rounded-lg"
                onChange={()=> setShow(!show)}/>
                </div>
                <label className="text-black text-left pt-10">
                    Confirm Password:
                </label>
                <input type="password"
                className="border border-black rounded-md text-xl pt-2 pl-2 hover:border-3 border-black"
                placeholder="Re-Enter password"
                value={confirmPass}
                onChange={(e)=>setConPassword(e.target.value)}
                />
                <div className="flex justify-center pt-4">
                <button className="bg-blue-900 text-white w-30 h-15 rounded-xl text-charcoal text-xl m-5 shadow-lg hover:scale-110 font-bold"
                 type="submit">Sign Up</button>
                
                </div>
                </div>
        </form>
            </div>
        </div>
    );
}