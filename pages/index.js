import React from "react";
import config from "../config.json";
import styled from "styled-components";
import { StyledTimeline } from "../src/components/Timeline"
import Menu from "../src/components/Menu/Menu";
import { createClient } from "@supabase/supabase-js"
import { videoService } from "../src/components/services/videoService";



export default function Home() {

  // conceito da busca
  // const valorDoFiltro = "m"; // procurando os vídeos que contêm a letra 'm' no título
    const [valorDoFiltro, setValorDoFiltro] = React.useState("");

    const [playlists, setPlaylists] = React.useState({});

    const service = videoService();

    React.useEffect(() => {
        console.log("useEffect");

        service
            .getAllVideos()
            .then((dados) => {
                console.log(dados.data);

                // Forma imutavel
                const novasPlaylists = {};

                dados.data.forEach((video) => {
                    if (!novasPlaylists[video.playlist]) novasPlaylists[video.playlist] = [];
                    novasPlaylists[video.playlist] = [
                        video,
                        ...novasPlaylists[video.playlist],
                    ];
                });

                setPlaylists(novasPlaylists);
            });
    }, []);



        return (
            <>
                <div style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                    }}>

                    {/* prop drilling - perfura a aplicação passando as informações por ali*/}
                    <Menu valorDoFiltro={valorDoFiltro} setValorDoFiltro={setValorDoFiltro}/>
                    <Header />
                    <Timeline searchValue={valorDoFiltro} playlists={config.playlists} />
                </div>
            </>
        )
} 


const StyledHeader = styled.div`
    background-color: ${({ theme }) => theme.backgroundLevel1};

    img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-left: 0.2rem;
    }

    .user-info {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 16px 32px;
        gap: 16px;
    }

    .user-info p {
        padding-top: .2rem;
    }
`;

const StyledBanner = styled.div`
    /* background-image: url(${({ bg }) => bg}); */
    background-image: url(${config.bg});
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    height: 27rem;
`;

function Header() {
    return(
        <StyledHeader>
            <StyledBanner bg={config.bg} />
                <section className="user-info">
                    <img src={`https://github.com/${config.github}.png`} />
                    <div>
                        <h2>
                            {config.name}
                        </h2>
                        <p>
                            {config.job}
                        </p>
                    </div>
                </section>
        </StyledHeader>
    )
}

function Timeline({searchValue, ...propriedades}) {

    const playlistNames = Object.keys(propriedades.playlists);

    return (
        <StyledTimeline>
            {playlistNames.map((playlistName) => {
                const videos = propriedades.playlists[playlistName];

                return (
                    <section key={playlistName}>
                        <h2>{playlistName}</h2>
                        <div>
                            {videos
                                // o que sai do filter é um array -> js puro
                                .filter((video) => {
                                    const titleNormalized = video.title.toLowerCase();
                                    const searchValueNormalized = searchValue.toLowerCase();
                                    return titleNormalized.includes(searchValueNormalized)

                                })
                                // o que sai do map é um array -> js puro
                                .map((video) => {
                                    return (
                                        <a key={video.url} href={video.url}>
                                            <img src={video.thumb} />
                                            <span>
                                                {video.title}
                                            </span>
                                        </a>
                                    )
                                })}
                        </div>
                    </section>
                )
            })}
        </StyledTimeline>
    )
}