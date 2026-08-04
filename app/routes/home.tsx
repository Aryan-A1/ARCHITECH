import { ArrowBigRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import type {Route} from "./+types/home";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import { useNavigate } from "react-router";


export default function Home() {

  const navigate = useNavigate();
  const handleUploadComplete = async (base64Image : string) => {
    const newId = Date.now().toString();
    navigate(`/visualizer/${newId}`);
    return true;
  }
   
  return (
    <div className = "home">
      <Navbar />

      <section className="hero">
              <div className="announce">
                <div className="dot">
                  <div className="pulse"></div>
                </div>

                <p>Introducing Architech 2.0</p>

              </div>

              <h1>Building beautiful spaces at the speed of thought with Architech</h1>

              <p className="subtitle">Architech is an ai-first design environment that helps you visualize, render, ship architectural projects faster than ever </p>

              <div className="actions">
                <a href="#upload" className="cta">
                  Start Building <ArrowRight className="icon"/>
                </a>

                <Button variant="outline" size="lg" className="Demo">Watch Demo</Button>
              </div>

              <div id ="upload" className="upload-shell">
                <div className="grid-overlay"/>
                <div className="upload-card">
                  <div className="upload-head">
                    <div className="upload-icon">
                      <Layers className="icon"/>
                    </div>
                    <h3>Upload your floor plan</h3>
                    <p>Supports JPG, PNG, formats up to 10MB</p>

                  </div>                  
                  <Upload onComplete = {handleUploadComplete}/>

                </div>

                
              </div>
      </section>


      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your lates work and shared community projects, all in one place.</p>
            </div>
          </div>

          <div className="projects-grid">
            <div className="project-card group">
              <div className="preview">
                <img src="/Italian Home Style.png" alt="Project" />
                <div className="badge">
                  <span>Community</span>
                </div>
              </div>

              <div className="card-body">
                <div>
                  <h3>Project Itly</h3>
                  <div className="meta">
                    <Clock size={12}>
                      <span>{new Date('03.13.2028').toLocaleDateString()}</span>
                    </Clock>
                    <span> By Beril</span>
                  </div>
                  <div>
                    <div className="arrow">
                      <ArrowUpRight size={18}></ArrowUpRight>
                    </div>
                  </div>
                </div>

              </div>

              
          

        </div>
        </div>
        </div>
      </section>

      


    </div>


  );
}
