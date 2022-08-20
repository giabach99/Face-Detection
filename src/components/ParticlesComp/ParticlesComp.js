import Particles from 'react-tsparticles';
import { loadFull } from "tsparticles";
import { useCallback } from "react";

function ParticlesComp() {
    const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);
    
    const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
    }, []);
    
    const particlesOptions = {
      background: {
          color: {
              value: 'linear-gradient(89deg, #FF5EDF 0%, #04C8DE 100%)',
          },
      },
      fpsLimit: 120,
      interactivity: {
          events: {
              onClick: {
                  enable: true,
                  mode: "push",
              },
              onHover: {
                  enable: true,
                  mode: "repulse",
              },
              resize: true,
          },
          modes: {
              push: {
                  quantity: 4,
              },
              repulse: {
                  distance: 200,
                  duration: 0.4,
              },
          },
      },
      particles: {
          color: {
              value: "#ffffff",
          },
          links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
          },
          collisions: {
              enable: true,
          },
          move: {
              directions: "none",
              enable: true,
              outModes: {
                  default: "bounce",
              },
              random: false,
              speed: 2.0,
              straight: false,
          },
          number: {
              density: {
                  enable: true,
                  area: 950,
              },
              value: 80,
          },
          opacity: {
              value: 0.5,
          },
          shape: {
              type: "circle",
          },
          size: {
              value: { min: 1, max: 5 },
          },
      },
      detectRetina: true,
    }

    return(
        <Particles 
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particlesOptions}
        />
    )
}

export default ParticlesComp;