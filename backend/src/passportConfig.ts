import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import { configs } from "./configs";

interface User {
  id: string;
  username: string;
  profileUrl?: string;
}

const users: User[] = [];

passport.use(
  new GitHubStrategy(configs, function (
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    let user = users.find((user) => user.id === profile.id);
    if (!user) {
      user = {
        id: profile.id,
        username: profile.username || "",
        profileUrl: profile.profileUrl || "",
      };
      users.push(user);
    }
    return done(null, user);
  })
);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser((id: string, done) => {
  const user = users.find((u) => u.id === id);

  done(null, user || null);
});

export default passport;
