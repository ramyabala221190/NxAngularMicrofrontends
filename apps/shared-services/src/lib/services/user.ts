import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, map, mergeMap, Observable, of, Subject, tap, throwError } from "rxjs";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn:'root'})
export class UserService {

    constructor(private http:HttpClient){}

   private userDetailSub$=new BehaviorSubject<User|null>(null);
   private usersList:User[]=[];

   login(credentials:{email:string,password:string}):Observable<string>{
      return this.http.get<{users:User[]}>('https://dummyjson.com/users').pipe(
        map((result:{users:User[]})=>result.users),
        mergeMap((users:User[])=>{
            this.usersList=users;
            const user:User|undefined=this.validateUser(credentials);
            if(user){
                this.setUser(user);
                return of("Login Success !!");
            }
            return throwError("Incorrect Username or Password");
        })
      )
   }
   
   private validateUser(credentials:{email:string,password:string}){
      return this.usersList.find(x=>x.email == credentials.email && x.password == credentials.password)
   }
   

   setUser(user:User|null){
      console.log(user);
      this.userDetailSub$.next(user);
   }

   getUser(){
    return this.userDetailSub$.asObservable();
   }
}
