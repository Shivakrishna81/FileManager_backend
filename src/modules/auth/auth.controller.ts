import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    
    constructor(private readonly authservice:AuthService){}

    @Get('login')
    async login(@Res() res:Response){
        const authurl=await this.authservice.login()
        return res.send(authurl)
    }

    @Post('callback')
    async callback(@Body('code') code:string){
        console.log("code",code)
        const userProfile=await this.authservice.callback(code);
        return userProfile
    }
}
