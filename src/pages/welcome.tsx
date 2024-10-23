import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";
import { type Genres } from "./api/books/genres";

const maxSteps = 3;
const country_list = [
  "Afganistán",
  "Albania",
  "Argelia",
  "Andorra",
  "Angola",
  "Anguila",
  "Antigua y Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaiyán",
  "Bahamas",
  "Baréin",
  "Bangladés",
  "Barbados",
  "Bielorrusia",
  "Bélgica",
  "Belice",
  "Benín",
  "Bermudas",
  "Bhután",
  "Bolivia",
  "Bosnia y Herzegovina",
  "Botsuana",
  "Brasil",
  "Islas Vírgenes Británicas",
  "Brunéi",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Camboya",
  "Camerún",
  "Cabo Verde",
  "Islas Caimán",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Islas Cook",
  "Costa Rica",
  "Costa de Marfil",
  "Croacia",
  "Barco de crucero",
  "Cuba",
  "Chipre",
  "República Checa",
  "Dinamarca",
  "Yibuti",
  "Dominica",
  "República Dominicana",
  "Ecuador",
  "Egipto",
  "El Salvador",
  "Guinea Ecuatorial",
  "Estonia",
  "Etiopía",
  "Islas Malvinas",
  "Islas Feroe",
  "Fiyi",
  "Finlandia",
  "Francia",
  "Polinesia Francesa",
  "Indias Occidentales Francesas",
  "Gabón",
  "Gambia",
  "Georgia",
  "Alemania",
  "Ghana",
  "Gibraltar",
  "Grecia",
  "Groenlandia",
  "Granada",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bisáu",
  "Guyana",
  "Haití",
  "Honduras",
  "Hong Kong",
  "Hungría",
  "Islandia",
  "India",
  "Indonesia",
  "Irán",
  "Irak",
  "Irlanda",
  "Isla de Man",
  "Israel",
  "Italia",
  "Jamaica",
  "Japón",
  "Jersey",
  "Jordania",
  "Kazajistán",
  "Kenia",
  "Kuwait",
  "República Kirguisa",
  "Laos",
  "Letonia",
  "Líbano",
  "Lesoto",
  "Liberia",
  "Libia",
  "Liechtenstein",
  "Lituania",
  "Luxemburgo",
  "Macao",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malasia",
  "Maldivas",
  "Malí",
  "Malta",
  "Mauritania",
  "Mauricio",
  "México",
  "Moldavia",
  "Mónaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Marruecos",
  "Mozambique",
  "Namibia",
  "Nepal",
  "Países Bajos",
  "Antillas Neerlandesas",
  "Nueva Caledonia",
  "Nueva Zelanda",
  "Nicaragua",
  "Níger",
  "Nigeria",
  "Noruega",
  "Omán",
  "Pakistán",
  "Palestina",
  "Panamá",
  "Papúa Nueva Guinea",
  "Paraguay",
  "Perú",
  "Filipinas",
  "Polonia",
  "Portugal",
  "Puerto Rico",
  "Catar",
  "Reunión",
  "Rumanía",
  "Rusia",
  "Rwanda",
  "San Pedro y Miquelón",
  "Samoa",
  "San Marino",
  "Satélite",
  "Arabia Saudita",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leona",
  "Singapur",
  "Eslovaquia",
  "Eslovenia",
  "Sudáfrica",
  "Corea del Sur",
  "España",
  "Sri Lanka",
  "San Cristóbal y Nieves",
  "Santa Lucía",
  "San Vicente",
  "Santa Lucía",
  "Sudán",
  "Surinam",
  "Suazilandia",
  "Suecia",
  "Suiza",
  "Siria",
  "Taiwán",
  "Tayikistán",
  "Tanzania",
  "Tailandia",
  "Timor Leste",
  "Togo",
  "Tonga",
  "Trinidad y Tobago",
  "Túnez",
  "Turquía",
  "Turkmenistán",
  "Islas Turcas y Caicos",
  "Uganda",
  "Ucrania",
  "Emiratos Árabes Unidos",
  "Reino Unido",
  "Uruguay",
  "Uzbekistán",
  "Venezuela",
  "Vietnam",
  "Islas Vírgenes (EE. UU.)",
  "Yemen",
  "Zambia",
  "Zimbabue",
];

export default function Page() {
  const [step, setStep] = useState(0);
  const { data: genres } = useQuery<Genres[]>({
    queryKey: ["books/genres"],
  });
  const [name, setName] = useState<string>();
  const [country, setCountry] = useState("Argentina");
  const [gender, setGender] = useState<string>();
  const [birthDate, setBirthDate] = useState<string>();
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);

  const { data } = useSession();
  useEffect(() => {
    if (data?.user?.name) {
      setName(data.user.name);
    }
  }, [data]);

  function Step1() {
    return (
      <div className="grid grid-cols-2 gap-6 py-7">
        <div>
          <Label>Nombre</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="country">Pais</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {country_list.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gender">Genero</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Femenino</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
          <Input
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            id="birthDate"
            type="date"
          />
        </div>
      </div>
    );
  }

  function validateStep1() {
    return (
      name !== undefined &&
      name.length > 0 &&
      country !== undefined &&
      gender !== undefined &&
      birthDate !== undefined
    );
  }

  function Step2() {
    return (
      <div>
        <h1>Elegí tus géneros favoritos</h1>
        <div className="grid grid-cols-5 gap-3 py-7">
          {genres?.map((genre) => (
            <div
              className={cn(
                "cursor-pointer rounded-md border border-slate-200 bg-slate-50 py-3 text-center text-sm hover:bg-slate-100",
                favoriteGenres.includes(genre.name) &&
                  "bg-blue-500 text-white hover:bg-blue-500",
              )}
              onClick={() => {
                if (favoriteGenres.includes(genre.name)) {
                  setFavoriteGenres(
                    favoriteGenres.filter((g) => g !== genre.name),
                  );
                } else {
                  setFavoriteGenres([...favoriteGenres, genre.name]);
                }
              }}
              key={genre.id}
            >
              {genre.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function validateStep2() {
    return favoriteGenres.length > 0;
  }

  const steps = [
    {
      component: Step1,
      validator: validateStep1,
      errorMessage: "Por favor completá todos los campos",
    },
    {
      component: Step2,
      validator: validateStep2,
      errorMessage: "Por favor seleccioná al menos un género",
    },
  ];

  const currentStep = steps[step]!;

  return (
    <div className={`bg-book-pattern bg-slate-100 bg-repeat`}>
      <div className={`min-h-screen w-full bg-slate-100/80 py-5`}>
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-4 shadow shadow-slate-200">
          <div>
            <div className="h-1 rounded-full bg-slate-100 transition-all duration-500 ease-in-out" />
            <div
              style={{
                width: `${(step / maxSteps) * 100}%`,
              }}
              className="z-10 -mt-1 h-1 rounded-full bg-blue-500 transition-all duration-500 ease-in-out"
            />
            <div className="flex items-baseline justify-between pt-2">
              <h2 className="text-lg font-semibold text-slate-800">
                Responde estas preguntas para terminar de completar tu perfil
              </h2>
              <span className="text-xs text-slate-500">
                {step + 1} / {maxSteps}
              </span>
            </div>
            {<currentStep.component />}
            <div className="flex justify-end gap-3 pt-2">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  size="sm"
                >
                  Anterior
                </Button>
              )}
              <Button
                onClick={() => {
                  const isValid = currentStep.validator();
                  if (!isValid) {
                    toast.error(currentStep.errorMessage);
                    return;
                  }
                  setStep(step + 1);
                }}
                size="sm"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { country_list };

// import { useEffect, useState } from "react";
// import { type UserInfo, UserInfoFilterBy, type UserInfoFilter } from "../types";
// import usersService from "../services/usersService";
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Box,
//   Button,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const Users = () => {
//   const [users, setUsers] = useState<Array<UserInfo>>([]);
//   const [originalUsers, setOriginalUsers] = useState<Array<UserInfo>>([]);

//   useEffect(() => {
//     try {
//       console.log("fetching...");
//       usersService.getAllUsers().then((fetchedUsers) => {
//         setUsers(fetchedUsers);
//         setOriginalUsers(fetchedUsers);
//       });
//     } catch (err) {
//       if (err instanceof Error) {
//         console.error(err.message);
//         // TODO: Show an error notification
//       }
//     }
//   }, []);

//   const onSubmit = async (
//     values: UserInfoFilter,
//     { resetForm }: { resetForm: () => void },
//   ) => {
//     console.log("🚀 ~ TwitSnaps ~ values:", values);
//     const filter = values.filter;
//     const filterBy = values.filterBy;

//     if (originalUsers.length === 0 || filter.trim() === "") {
//       return;
//     }

//     const filteredTwits = originalUsers.filter((twit) => {
//       const value = String(twit[filterBy]);
//       return value.toLowerCase().includes(filter.toLowerCase());
//     });

//     setUsers(filteredTwits);

//     resetForm();
//   };

//   const onReset = () => {
//     setUsers(originalUsers);
//     formik.resetForm();
//   };

//   const validationSchema = Yup.object({
//     filter: Yup.string().required("Filter value is required"),
//     filterBy: Yup.mixed<UserInfoFilterBy>()
//       .oneOf(Object.values(UserInfoFilterBy))
//       .required("Filter by is required"),
//   });

//   const formik = useFormik({
//     initialValues: {
//       filterBy: UserInfoFilterBy.id,
//       filter: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: onSubmit,
//   });

//   return (
//     <>
//       <form className="mt-3 px-3" onSubmit={formik.handleSubmit}>
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <TextField
//             sx={{ mt: 2, width: "70%", justifyContent: "end" }}
//             name="filter"
//             label="Enter something"
//             value={formik.values.filter}
//             onChange={formik.handleChange}
//           ></TextField>
//           <Box sx={{ width: "30%" }}>
//             <InputLabel id="filter-by-label">Filter By</InputLabel>
//             <Select
//               labelId="filter-by-label"
//               id="filter-by-select"
//               label="Filter by"
//               name="filterBy"
//               sx={{ width: "100%" }}
//               defaultValue={formik.values.filterBy}
//               onChange={formik.handleChange}
//               value={formik.values.filterBy}
//             >
//               <MenuItem value={"id"}>ID</MenuItem>
//               <MenuItem value={"email"}>Email</MenuItem>
//               <MenuItem value={"user"}>User</MenuItem>
//               <MenuItem value={"name"}>Name</MenuItem>
//               <MenuItem value={"location"}>Location</MenuItem>
//               <MenuItem value={"interests"}>Interests</MenuItem>
//               <MenuItem value={"goals"}>Goals</MenuItem>
//               <MenuItem value={"followers"}>Followers</MenuItem>
//               <MenuItem value={"followeds"}>Followeds</MenuItem>
//               <MenuItem value={"twitsnaps"}>Twitsnaps</MenuItem>
//             </Select>
//           </Box>
//         </Box>
//         <Button
//           type="submit"
//           sx={{
//             mt: 1,
//             width: "100%",
//             bgcolor: "#112334",
//             color: "white",
//           }}
//         >
//           Filter
//         </Button>
//         <Button
//           onClick={onReset}
//           sx={{
//             mt: 1,
//             width: "100%",
//             bgcolor: "#112334",
//             color: "white",
//           }}
//         >
//           Reset Filter
//         </Button>
//       </form>
//       <Box sx={{ mt: 10 }}>
//         {users.length > 0 &&
//           users.map((user) => (
//             <Accordion key={user.id}>
//               <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />}
//                 aria-controls="panel1-content"
//                 id="panel1-header"
//                 className="mt-10 flex h-10 gap-3"
//               >
//                 <Typography className="flex items-center">
//                   {user.user}
//                 </Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <Typography>ID: {user.id}</Typography>
//                 <Typography>Name: {user.name}</Typography>
//                 <Typography>Email: {user.email}</Typography>
//                 <Typography>Location: {user.location}</Typography>
//                 <Typography>
//                   interests:{" "}
//                   {user.interests.map((interest) => (
//                     <Typography>{interest}</Typography>
//                   ))}
//                 </Typography>
//                 <Typography>
//                   Goals:{" "}
//                   {user.goals.map((goal) => (
//                     <Typography>{goal}</Typography>
//                   ))}
//                 </Typography>
//                 <Typography>
//                   Followers:{" "}
//                   {user.followers.map((follower) => (
//                     <Typography>{follower}</Typography>
//                   ))}
//                 </Typography>
//                 <Typography>
//                   Followeds:{" "}
//                   {user.followeds.map((followed) => (
//                     <Typography>{followed}</Typography>
//                   ))}
//                 </Typography>
//                 <Typography>
//                   Twitsnaps:{" "}
//                   {user.twitsnaps.map((twitsnap) => (
//                     <Typography>{twitsnap}</Typography>
//                   ))}
//                 </Typography>
//               </AccordionDetails>
//             </Accordion>
//           ))}
//       </Box>
//     </>
//   );
// };

// export default Users;
