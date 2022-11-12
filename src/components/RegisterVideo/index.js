import { StyledRegisterVideo } from "./styles";
import React from 'react';
import { createClient } from "@supabase/supabase-js"


// criação de um hook personalizado p/ extrair a lógica do formulário
function useForm(propsDoForm) {
    const [values, setValues] = React.useState(propsDoForm.initialValues);

    return{
        values,
        handleChange: (event) => {
            // console.log(event.target);
            const value = event.target.value;
            const name = event.target.name
            
            setValues({
                ...values,
                [name]: value,
            });
        },
        clearForm() {
            setValues({});
        }
    };
}


const PROJECT_URL = "https://brsamdydoholonsdrqkv.supabase.co";
const PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyc2FtZHlkb2hvbG9uc2RycWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgyMTE3MjAsImV4cCI6MTk4Mzc4NzcyMH0.Q35VfCOwxRB-YjQpUjdXHOSIrYQrXMim3yznA3ohoFc";
const supabase = createClient(PROJECT_URL, PUBLIC_KEY);

function getThumbnail(url) {
    return `https://img.youtube.com/vi/${url.split("v=")[1]}/hqdefault.jpg`;
}

export default function RegisterVideo() {
    const formCadastro = useForm({ 
        initialValues: { titulo: "aaaa", url: "https://" }
    });

    const [formVisivel, setFormVisivel] = React.useState(false);

    return (
        <StyledRegisterVideo>
            <button type="button" className="add-video" onClick={() => setFormVisivel(true)}>
                +
            </button>

            {/* React usa mto ternário e
            operadores de curto circuito */}
            {formVisivel 
            ? (
                <form onSubmit={(event) => {
                    event.preventDefault(); // p/ o nav não atualizar todo(é um comportamento padrão)
                    // console.log(formCadastro.values);

                    supabase.from("video").insert({
                        title: formCadastro.values.titulo,
                        url: formCadastro.values.url,
                        thumb: getThumbnail(formCadastro.values.url),
                        playlist: "Mônica Toy",
                    })
                    .then((oqueveio) => {
                        console.log(oqueveio);
                    })
                    .catch((err) => {
                        console.log(err);
                    })

                    setFormVisivel(false);
                    formCadastro.clearForm();
                }}>
                    <div>
                        <button className="close-modal" onClick={() => setFormVisivel(false)}>
                            X
                        </button>

                        <input  placeholder="Título do vídeo" 
                                name="titulo"
                                value={formCadastro.values.titulo} 
                                onChange={formCadastro.handleChange} />

                        <input  placeholder="URL" 
                                name="url"
                                value={formCadastro.values.url}
                                onChange={formCadastro.handleChange} />

                        <button type="submit">
                            Cadastrar
                        </button>
                    </div>
                </form>
            )
            : null}

        </StyledRegisterVideo>
    )
}