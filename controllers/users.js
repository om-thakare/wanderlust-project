const User = require("../models/user");

// ==============================
// RENDER SIGNUP FORM
// ==============================
module.exports.renderSignupForm = (req, res) => {
  return res.render("users/signup.ejs", { hideLayout: true });
};

// ==============================
// SIGNUP LOGIC
// ==============================
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust!");
      return res.redirect("/listings"); // ✅ return added
    });

  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/signup"); // ✅ return added
  }
};

// ==============================
// RENDER LOGIN FORM
// ==============================
module.exports.renderLoginForm = (req, res) => {
  return res.render("users/login.ejs", { hideLayout: true });
};

// ==============================
// LOGIN SUCCESS
// ==============================
module.exports.login = (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);

  const redirectUrl = res.locals.redirectUrl || "/listings";
  return res.redirect(redirectUrl); // ✅ return added
};

// ==============================
// LOGOUT
// ==============================
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "You are logged out!");
    return res.redirect("/listings"); // ✅ return added
  });
};
