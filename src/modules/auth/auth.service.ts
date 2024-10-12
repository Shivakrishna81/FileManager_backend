// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as querystring from 'querystring';
// import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { URLSearchParams } from 'url';

dotenv.config();

@Injectable()
export class AuthService {
  private users: any[] = []; // Replace with your user database model

  async login() {
    const redirectUri = process.env.REDIRECT_URI;
    const tenantId = process.env.TENANT_ID;
    const clientId = process.env.CLIENT_ID;
    console.log('Redirect URI:', redirectUri);
    console.log('Tenant ID:', tenantId);
    console.log('Client ID:', clientId);

    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=openid profile email User.Read`;

    return authUrl; // Return the URL for redirection
  }

  async callback(code: string) {
    try {
      const redirectUri = process.env.REDIRECT_URI;
      const tenantId = process.env.TENANT_ID;
      const clientId = process.env.CLIENT_ID;
      const clientSecret = process.env.CLIENT_SECRET;
      const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

      const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log(tokenResponse.data)
      let userDetails=await this.getUserDetails(tokenResponse.data.access_token)
      let data={
        token:tokenResponse.data.access_token,
        userDetails
      }
      return data

    } catch (err) {
      if (err.response) {
        console.error('Error response:', err.response.data);
      } else {
        console.error('Error message:', err.message);
      }
      throw new Error('Authentication failed');
    }


  }

  // async getToken(code:string){
  //   try{
 
  //     const token = await axios.post(`https://login.microsoftonline.com/380a88f6-5447-406c-bebb-2c908f53f0a3/oauth2/v2.0/token` ,
  //       new URLSearchParams({
  //           client_id: "0a8992fa-f124-4b04-a317-06b62cc31e84",
  //           client_secret: 'Wz98Q~1-DPrkO-hzcmn22ZlsSbqBhwxg~AJ5baSx',
  //           redirect_uri: 'http://localhost:3000/runway',
  //           code: code,
   
  //           grant_type: 'authorization_code',
  //       }).toString(),
  //       {
  //         headers:{
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //       }
  //     );
  //     // console.log("Backend Token", token)
  //     // console.log("ssssssssssss")
  //     // return token.data;
  //   return  this.getUserDetails(token.data.access_token)
 
  //   }catch(e){
  //       console.log("Error form Backend", e.message)
  //   }
  // }
 
 
  async getUserDetails(accessToken: string){
    try{
       console.log("access token in get users",accessToken)
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
 
      const response = await axios.get("https://graph.microsoft.com/v1.0/me", {headers});
      console.log(response.data)
      return response.data
 
    }catch(e){
        console.log("Error from getUserDetails", e.message)
    }
  }
 

 
  

  //   async inviteUser(email: string, role: string) {
  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail', // Adjust your email service
  //       auth: {
  //         user: process.env.EMAIL_USER,
  //         pass: process.env.EMAIL_PASS,
  //       },
  //     });

  //     const mailOptions = {
  //       from: process.env.EMAIL_USER,
  //       to: email,
  //       subject: 'You have been invited!',
  //       text: `You have been invited as a ${role}.`,
  //     };

  //     return transporter.sendMail(mailOptions);
  //   }
}
