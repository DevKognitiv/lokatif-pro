import { useState } from 'react';
import { Key, Eye, EyeOff, ArrowRight, Check, Home } from 'lucide-react';

interface Props {
  onLogin: (role: 'locataire' | 'propriétaire') => void;
}

export default function AuthScreen({ onLogin }: Props) {
  const [mode, setMode] = useState<'welcome' | 'login' | 'register' | 'role'>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'locataire' | 'propriétaire' | null>(null);

  if (mode === 'welcome') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 20%, rgba(255,107,53,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(201,168,76,0.1) 0%, transparent 60%)' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--grad-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-orange)', margin: '0 auto 16px' }}>
              <Key size={36} color="white" />
            </div>
            <div><span style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: -1 }}>Loka</span><span style={{ fontSize: 32, fontWeight: 900, color: 'var(--orange)', letterSpacing: -1 }}>tif</span></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Location directe · Abidjan & CI</p>
          </div>
          <div style={{ width: '100%', maxWidth: 340, marginBottom: 32, position: 'relative', height: 160 }}>
            {[{img:'apt-cocody-1',title:'Cocody',price:'250k',top:0,left:0,rot:-4},{img:'villa-plateau-1',title:'Plateau',price:'450k',top:20,left:60,rot:2},{img:'riviera-apt-1',title:'Riviera',price:'320k',top:10,left:120,rot:-1}].map((c,i)=>(
              <div key={i} style={{ position:'absolute', top:c.top, left:c.left, width:160, height:110, borderRadius:14, overflow:'hidden', border:'2px solid var(--border)', boxShadow:'var(--shadow-md)', transform:`rotate(${c.rot}deg)`, zIndex:i }}>
                <img src={`https://picsum.photos/seed/${c.img}/320/220`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
                <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'var(--grad-hero)', padding:'6px 10px' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'white' }}>{c.title}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)' }}>{c.price} FCFA/mois</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:32, flexWrap:'wrap', justifyContent:'center' }}>
            {['🏠 Sans intermédiaire','✓ Propriétaires vérifiés','💬 Contact direct'].map(v=>(
              <span key={v} style={{ fontSize:12, color:'var(--text-secondary)', background:'var(--bg-elevated)', padding:'5px 10px', borderRadius:'var(--radius-full)', border:'1px solid var(--border)' }}>{v}</span>
            ))}
          </div>
          <div style={{ width:'100%', maxWidth:340, display:'flex', flexDirection:'column', gap:12 }}>
            <button className="btn-primary" style={{ width:'100%', fontSize:16 }} onClick={()=>setMode('register')}>Créer un compte <ArrowRight size={18}/></button>
            <button className="btn-secondary" style={{ width:'100%' }} onClick={()=>setMode('login')}>Se connecter</button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'role') {
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg-app)', display:'flex', flexDirection:'column', padding:'60px 24px 40px', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:'100%', maxWidth:360 }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <h2 style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>Vous êtes ?</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:14 }}>Choisissez votre profil pour personnaliser votre expérience</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:28 }}>
            {[
              { role:'locataire' as const, icon:'🔑', title:'Je cherche un logement', desc:"Parcourez des milliers d\'annonces vérifiées à Abidjan", features:['Recherche avancée','Favoris & comparaison','Messagerie directe'] },
              { role:'propriétaire' as const, icon:'🏠', title:'Je loue mon bien', desc:'Publiez vos annonces et gérez vos locataires facilement', features:['Tableau de bord','Gestion des baux','Paiements Mobile Money'] },
            ].map(({role,icon,title,desc,features})=>(
              <button key={role} onClick={()=>setSelectedRole(role)} style={{ background:selectedRole===role?'rgba(255,107,53,0.1)':'var(--bg-elevated)', border:`2px solid ${selectedRole===role?'var(--orange)':'var(--border)'}`, borderRadius:'var(--radius-xl)', padding:18, cursor:'pointer', textAlign:'left', transition:'var(--transition)' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 }}>
                  <span style={{ fontSize:28 }}>{icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', marginBottom:3 }}>{title}</div>
                    <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.5 }}>{desc}</div>
                  </div>
                  {selectedRole===role&&<div style={{ width:22, height:22, borderRadius:'50%', background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Check size={13} color="white"/></div>}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                  {features.map(f=><span key={f} style={{ fontSize:11, color:selectedRole===role?'var(--orange-light)':'var(--text-muted)', background:selectedRole===role?'rgba(255,107,53,0.1)':'var(--bg-surface)', padding:'3px 8px', borderRadius:'var(--radius-full)', border:'1px solid var(--border)' }}>{f}</span>)}
                </div>
              </button>
            ))}
          </div>
          <button className="btn-primary" style={{ width:'100%', opacity:selectedRole?1:0.5, pointerEvents:selectedRole?'auto':'none' }} onClick={()=>selectedRole&&onLogin(selectedRole)}>
            Commencer <ArrowRight size={18}/>
          </button>
          <div style={{ marginTop:16, padding:14, background:'var(--bg-elevated)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)' }}>
            <p style={{ fontSize:11, color:'var(--text-muted)', textAlign:'center', marginBottom:8 }}>Accès démo rapide</p>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn-secondary" style={{ flex:1, fontSize:12 }} onClick={()=>onLogin('locataire')}><Home size={13}/> Locataire</button>
              <button className="btn-secondary" style={{ flex:1, fontSize:12 }} onClick={()=>onLogin('propriétaire')}><Key size={13}/> Propriétaire</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-app)', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'20px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <button className="btn-icon" onClick={()=>setMode('welcome')}><ArrowRight size={18} style={{ transform:'rotate(180deg)', color:'var(--text-secondary)' }}/></button>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)' }}>{mode==='login'?'Connexion':'Inscription'}</div>
          <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{mode==='login'?'Bon retour sur Lokatif !':'Rejoignez la communauté'}</div>
        </div>
      </div>
      <div style={{ flex:1, padding:'28px 24px', display:'flex', flexDirection:'column', gap:14, maxWidth:400, width:'100%', margin:'0 auto' }}>
        {mode==='register'&&<div><label style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:600, marginBottom:6, display:'block' }}>Nom complet</label><input className="input-field" placeholder="Kouassi Thomas"/></div>}
        <div><label style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:600, marginBottom:6, display:'block' }}>Email</label><input className="input-field" type="email" placeholder="vous@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div>
          <label style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:600, marginBottom:6, display:'block' }}>Mot de passe</label>
          <div style={{ position:'relative' }}>
            <input className="input-field" type={showPassword?'text':'password'} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} style={{ paddingRight:48 }}/>
            <button onClick={()=>setShowPassword(!showPassword)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button>
          </div>
        </div>
        {mode==='login'&&<div style={{ textAlign:'right' }}><span style={{ fontSize:13, color:'var(--orange)', cursor:'pointer', fontWeight:600 }}>Mot de passe oublié ?</span></div>}
        <button className="btn-primary" style={{ width:'100%', marginTop:4 }} onClick={()=>setMode('role')}>{mode==='login'?'Se connecter':'Créer mon compte'} <ArrowRight size={18}/></button>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}><div style={{ flex:1, height:1, background:'var(--border)' }}/><span style={{ fontSize:12, color:'var(--text-muted)' }}>ou</span><div style={{ flex:1, height:1, background:'var(--border)' }}/></div>
        <div style={{ display:'flex', gap:10 }}>
          {[{icon:'🇬',label:'Google'},{icon:'📱',label:'Orange Money'}].map(s=><button key={s.label} className="btn-secondary" style={{ flex:1, gap:8, fontSize:13 }}><span>{s.icon}</span>{s.label}</button>)}
        </div>
        <div style={{ textAlign:'center' }}>
          <span style={{ fontSize:14, color:'var(--text-secondary)' }}>{mode==='login'?"Pas encore de compte ? ":"Déjà un compte ? "}</span>
          <span style={{ fontSize:14, color:'var(--orange)', fontWeight:700, cursor:'pointer' }} onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?"S\'inscrire":'Se connecter'}</span>
        </div>
      </div>
    </div>
  );
}
