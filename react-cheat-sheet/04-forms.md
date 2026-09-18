# Forms

## Rozděl formulář na vrstvy

```text
form/
├── form.tsx             # composition / route boundary
├── form-client.tsx      # useForm a client interakce
├── components/          # field a sekce
├── models/schema.ts     # schema a odvozený typ
└── hooks/               # submit a side effects
```

## Schema je zdroj typu

```tsx
import { z } from "zod";

const UserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
  phone: z.string().nullable()
});

type UserForm = z.infer<typeof UserSchema>;
```

U controlled fieldů je praktičtější reprezentovat prázdnou hodnotu explicitně (`null` nebo `""`) než směšovat `undefined`, `null` a prázdný string.

## Field wrapper

```tsx
const TextField = ({ name }: { name: "email" | "displayName" }) => {
  const { control } = useFormContext<UserForm>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input {...field} error={fieldState.error?.message} />
      )}
    />
  );
};

export { TextField };
```

Field wrapper má řešit napojení formuláře na UI primitive. Nemá obsahovat business rozhodnutí celé feature.

## Form side effects

Reakci na změnu fieldů odděl do hooku a vždy uklízej subscription:

```tsx
useEffect(() => {
  const subscription = watch((value, { name }) => {
    if (name === "country") {
      resetField("postalCode");
    }
  });

  return () => subscription.unsubscribe();
}, [resetField, watch]);
```

## Submit flow

1. Validace form dat.
2. Převod form modelu na API request.
3. Odeslání requestu.
4. Normalizace API chyby.
5. Success state nebo error boundary/message.

Neumisťuj mapování API payloadu přímo do JSX event handleru.
