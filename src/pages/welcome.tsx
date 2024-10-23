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
import { toast } from "sonner";
import { createUser } from "./api/user";

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
const genres = [
  "Arte",
  "Biografía",
  "Negocios",
  "Chick Lit",
  "Infantil",
  "Cristiano",
  "Clásicos",
  "Cómics",
  "Contemporáneo",
  "Libros de cocina",
  "Crimen",
  "Ebooks",
  "Fantasía",
  "Ficción",
  "Gay y lésbico",
  "Novelas gráficas",
  "Ficción histórica",
  "Historia",
  "Terror",
  "Humor y comedia",
  "Manga",
  "Memorias",
  "Música",
  "Misterio",
  "No ficción",
  "Paranormal",
  "Filosofía",
  "Poesía",
  "Psicología",
  "Religión",
  "Romance",
  "Ciencia",
  "Ciencia ficción",
  "Autoayuda",
  "Suspenso",
  "Espiritualidad",
  "Deportes",
  "Thriller",
  "Viajes",
  "Jóvenes adultos",
];

export default function Page() {
  const [step, setStep] = useState(0);

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
          {genres.map((genre) => (
            <div
              className={cn(
                "cursor-pointer rounded-md border border-slate-200 bg-slate-50 py-3 text-center text-sm hover:bg-slate-100",
                favoriteGenres.includes(genre) &&
                  "bg-blue-500 text-white hover:bg-blue-500",
              )}
              onClick={() => {
                if (favoriteGenres.includes(genre)) {
                  setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
                } else {
                  setFavoriteGenres([...favoriteGenres, genre]);
                }
              }}
              key={genre}
            >
              {genre}
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
                onClick={async () => {
                  const isValid = currentStep.validator();
                  if (!isValid) {
                    toast.error(currentStep.errorMessage);
                    return;
                  }
                  if (step == maxSteps) {
                    await createUser(
                      {
                        name,
                        country,
                        gender,
                        birth_date: birthDate,
                      },
                      favoriteGenres,
                    );
                  } else {
                    setStep(step + 1);
                  }
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
