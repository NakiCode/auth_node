
// function verifierTypeDonnee(donnee) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const telephoneRegex = /^\d{10}$/;
  
//     if (emailRegex.test(donnee)) {

//     } else if (telephoneRegex.test(donnee)) {
//       console.log("C'est un numéro de téléphone");
//     } else {
//       console.log("C'est une chaîne de caractères");
//     }
//   }

//   let credationis = emailregex.test(donnee) ? donnee : telephoneregex.test(donnee) ? donnee : donnee;
//     const verification = tbl_User.find({
//         $or: [
//           { email: { $regex: query, $options: 'i' } }, // Recherche dans le champ email (insensible à la casse)
//           { username: { $regex: query, $options: 'i' } }, // Recherche dans le champ username (insensible à la casse)
//           { phone: { $regex: query, $options: 'i' } } // Recherche dans le champ phone (insensible à la casse)
//         ]
//       })

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const telephoneRegex = /^\d{10}$/;
//     const donnee = req.body.name