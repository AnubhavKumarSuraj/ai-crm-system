import React, { useState, useRef } from 'react';
import { useApp } from '../components/Layout';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Input, { FormField, Select, Textarea } from '../components/Input';
import { localId, todayISO, sleep, formatDate } from '../utils/helpers';
import { sendAiCampaign } from '../services/api';

function AICampaignBuilderModal({ isOpen, onClose, onSuccess, initialPreset }) {
  const [step, setStep] = useState(1); // 1: input, 2: preview
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [offerText, setOfferText] = useState('');
  const [audience, setAudience] = useState('inactive');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const fileInputRef = useRef(null);

  // Reset when opened
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setImage(null);
      setOfferText(initialPreset?.offerText || '');
      setAudience(initialPreset?.audience || 'inactive');
      setGeneratedMessage('');
    }
  }, [isOpen, initialPreset]);

  const handleGenerate = async () => {
    setLoading(true);
    await sleep(800);
    setGeneratedMessage(`Hi {name}, we have a special ${offerText || 'offer'} just for you! Check out our latest collection and enjoy exclusive benefits. Visit us today!`);
    setStep(2);
    setLoading(false);
  };

  const handleSend = async () => {
    console.log('SEND CAMPAIGN CLICKED');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', `AI Campaign - ${formatDate(todayISO())}`);
      formData.append('message', generatedMessage);
      formData.append('audience', audience);
      if (image) formData.append('image', image);

      console.log('CALLING BACKEND:', 'http://localhost:5000/api/campaigns/send-ai');
      const res = await sendAiCampaign(formData);
      console.log('API RESPONSE:', res);

      const newCampaign = {
        id: res.campaign_id || localId('ai'),
        name: `AI Campaign - ${formatDate(todayISO())}`,
        message: generatedMessage,
        type: 'automated',
        status: 'sent',
        sent: res.messages_sent || 0,
        created: todayISO(),
      };
      onSuccess(newCampaign);
      onClose();
    } catch (err) {
      console.error('API ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Campaign Builder">
      <Modal.Body>
        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className="w-8 h-8 mb-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-sm font-medium">{image ? image.name : 'Click to upload product image'}</span>
                <input type="file" className="hidden" ref={fileInputRef} onChange={e => setImage(e.target.files[0])} accept="image/*" />
              </div>
            </div>

            <FormField label="Offer Text (Optional)">
              <Input 
                placeholder="e.g. 20% off on new arrivals" 
                value={offerText}
                onChange={e => setOfferText(e.target.value)}
              />
            </FormField>

            <FormField label="Target Audience">
              <Select value={audience} onChange={e => setAudience(e.target.value)}>
                <option value="inactive">Inactive Customers (&gt;30 days)</option>
                <option value="recent">Recent Visitors</option>
                <option value="all">All Selected Customers</option>
              </Select>
            </FormField>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <h4 className="font-semibold text-indigo-900">Generated Message</h4>
              </div>
              <Textarea 
                rows={4} 
                value={generatedMessage}
                onChange={e => setGeneratedMessage(e.target.value)}
                className="bg-white border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="text-sm text-gray-600 flex justify-between px-1">
              <span>Audience: <span className="font-semibold text-gray-900 capitalize">{audience}</span></span>
              <span>Est. Recipients: <span className="font-semibold text-gray-900">~150</span></span>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        {step === 1 ? (
          <Button variant="hero" onClick={handleGenerate} disabled={loading} className="shadow-indigo-500/20 shadow-md">
            {loading ? 'Generating...' : 'Generate Message'}
          </Button>
        ) : (
          <Button variant="hero" onClick={() => { console.log('REAL BUTTON CLICKED'); handleSend(); }} disabled={loading} className="shadow-indigo-500/20 shadow-md">
            {loading ? 'Sending...' : 'Send Campaign'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

function QuickActionCard({ title, desc, icon, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
    >
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

function SimplifiedCampaignCard({ campaign }) {
  const status = campaign.status || 'Completed';
  const sent = campaign.sent || Math.floor(Math.random() * 500) + 50; // Mock if undefined
  
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-gray-900 line-clamp-1">{campaign.name}</h4>
        <Badge variant={status === 'Running' ? 'success' : 'default'} className="shrink-0 text-xs">
          {status}
        </Badge>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Messages Sent</span>
          <span className="text-lg font-bold text-gray-900">{sent}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </div>
      </div>
    </div>
  );
}

export default function Campaigns() {
  const { campaigns, setCampaigns, showToast, addLog } = useApp();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderPreset, setBuilderPreset] = useState(null);

  // Hero Section State
  const [heroStep, setHeroStep] = useState(1);
  const [heroImage, setHeroImage] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroMessage, setHeroMessage] = useState('');
  const [heroLoading, setHeroLoading] = useState(false);
  const heroFileInputRef = useRef(null);

  const handleCampaignSuccess = (campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
    showToast('Campaign successfully launched!', 'success');
    addLog('Campaign Launched', campaign.name, 'success');
  };

  const handleHeroUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      setHeroImage(URL.createObjectURL(file));
      setHeroStep(2);
    }
  };

  const handleHeroGenerate = async () => {
    setHeroLoading(true);
    await sleep(1800);
    setHeroMessage('Hi Rahul 👋 We missed you! Get 20% off this week 🎁 Visit us before the offer expires. Tap to claim your deal now!');
    setHeroStep(3);
    setHeroLoading(false);
  };

  const handleHeroSend = async () => {
    console.log('SEND CAMPAIGN CLICKED');
    setHeroLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', `AI Campaign - ${formatDate(todayISO())}`);
      formData.append('message', heroMessage);
      formData.append('audience', 'all');
      if (heroImageFile) {
        formData.append('image', heroImageFile);
      }

      console.log('CALLING BACKEND:', 'http://localhost:5000/api/campaigns/send-ai');
      const res = await sendAiCampaign(formData);
      console.log('API RESPONSE:', res);

      const newCampaign = {
        id: res.campaign_id || localId('ai'),
        name: `AI Campaign - ${formatDate(todayISO())}`,
        message: heroMessage,
        type: 'automated',
        status: 'sent',
        sent: res.messages_sent || 0,
        created: todayISO(),
      };
      handleCampaignSuccess(newCampaign);
      showToast(`Sent to ${res.messages_sent} customers!`, 'success');
    } catch (err) {
      console.error('API ERROR:', err);
      showToast(`Send failed: ${err.message}`, 'error');
    } finally {
      setHeroStep(1);
      setHeroImage(null);
      setHeroImageFile(null);
      setHeroMessage('');
      setHeroLoading(false);
    }
  };

  const openPreset = (preset) => {
    setBuilderPreset(preset);
    setBuilderOpen(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden min-h-[340px]">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 mb-4 w-32 h-32 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-8 h-full">

          {/* LEFT: Step content */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                    s < heroStep ? 'bg-white text-indigo-700 border-white' :
                    s === heroStep ? 'bg-white/20 border-white text-white' :
                    'bg-white/10 border-white/20 text-white/40'
                  }`}>{s < heroStep ? '✓' : s}</div>
                  {s < 3 && <div className={`w-8 h-0.5 rounded transition-all duration-300 ${s < heroStep ? 'bg-white' : 'bg-white/20'}`}></div>}
                </div>
              ))}
              <span className="ml-2 text-white/60 text-xs font-medium">
                {heroStep === 1 ? 'Upload Product' : heroStep === 2 ? 'Generate Message' : 'Send Campaign'}
              </span>
            </div>

            {/* Step 1 */}
            {heroStep === 1 && (
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Create AI Campaign</h2>
                <p className="text-indigo-100 mb-8 text-base md:text-lg font-medium opacity-90">
                  Upload your product image to get started.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="whitePrimary"
                    className="px-6 py-3 font-semibold text-base"
                    onClick={() => heroFileInputRef.current?.click()}
                  >
                    ↑ Upload Product
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="px-6 py-3 font-medium text-base opacity-30 cursor-not-allowed border-white/20 text-white"
                  >
                    Generate Campaign
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {heroStep === 2 && (
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Ready to Generate</h2>
                <p className="text-indigo-100 mb-8 text-base md:text-lg font-medium opacity-90">
                  {heroLoading
                    ? 'AI is crafting your message…'
                    : 'Image uploaded. Let AI write a personalised message.'}
                </p>
                {heroLoading && (
                  <div className="flex gap-1 mb-6">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="whitePrimary"
                    className="px-6 py-3 font-semibold text-base"
                    onClick={handleHeroGenerate}
                    disabled={heroLoading}
                  >
                    {heroLoading ? 'Generating…' : '⚡ Generate Campaign'}
                  </Button>
                  <button
                    onClick={() => { setHeroStep(1); setHeroImage(null); }}
                    className="text-white/60 hover:text-white text-sm underline underline-offset-2 transition-colors"
                  >
                    Re-upload
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {heroStep === 3 && (
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Campaign Ready 🚀</h2>
                <p className="text-indigo-100 mb-8 text-base md:text-lg font-medium opacity-90">
                  Your message is crafted. Review and send to customers.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="whitePrimary"
                    className="px-6 py-3 font-semibold text-base"
                    onClick={() => { console.log('REAL BUTTON CLICKED'); handleHeroSend(); }}
                    disabled={heroLoading}
                  >
                    {heroLoading ? 'Sending…' : '📤 Send Campaign'}
                  </Button>
                  <button
                    onClick={() => { setHeroStep(1); setHeroImage(null); setHeroMessage(''); }}
                    className="text-white/60 hover:text-white text-sm underline underline-offset-2 transition-colors"
                  >
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Visual panel */}
          <div className="w-full md:w-72 flex items-center justify-center">

            {/* Step 1: Upload zone */}
            {heroStep === 1 && (
              <div
                onClick={() => heroFileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-white/60 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">Click to upload image</span>
              </div>
            )}

            {/* Step 2: Image preview */}
            {heroStep === 2 && heroImage && (
              <div className="relative">
                <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 rotate-2 hover:rotate-0 transition-transform duration-300">
                  <img src={heroImage} alt="Product" className="w-full h-full object-cover" />
                </div>
                {heroLoading && (
                  <div className="absolute inset-0 rounded-2xl bg-indigo-900/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: WhatsApp message card */}
            {heroStep === 3 && (
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs text-gray-800 -rotate-1 hover:rotate-0 transition-transform duration-300 overflow-hidden">
                {/* WhatsApp header */}
                <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Your Store</div>
                    <div className="text-green-200 text-xs">WhatsApp Business</div>
                  </div>
                </div>
                {/* Message bubble */}
                <div className="p-4 bg-[#ECE5DD]">
                  {heroImage && (
                    <img src={heroImage} alt="Product" className="w-full h-28 object-cover rounded-lg mb-2" />
                  )}
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
                    <p className="text-sm text-gray-800 leading-relaxed">{heroMessage}</p>
                    <p className="text-right text-[10px] text-gray-400 mt-1">✓✓ Just now</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        <input type="file" className="hidden" ref={heroFileInputRef} onChange={handleHeroUpload} accept="image/*" />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard 
            title="Recover inactive customers" 
            desc="Send win-back offers"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
            onClick={() => openPreset({ audience: 'inactive', offerText: 'We miss you! 15% off' })}
          />
          <QuickActionCard 
            title="Send offer to recent visitors" 
            desc="Convert high-intent users"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
            onClick={() => openPreset({ audience: 'recent', offerText: 'Complete your purchase' })}
          />
          <QuickActionCard 
            title="Festival campaign" 
            desc="Holiday special messages"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
            onClick={() => openPreset({ audience: 'all', offerText: 'Happy Holidays! 20% off everything' })}
          />
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">Active Campaigns</h3>
        
        {(!Array.isArray(campaigns) || campaigns.length === 0) ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">No active campaigns. Launch one from above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(Array.isArray(campaigns) ? campaigns : []).map(camp => (
              <SimplifiedCampaignCard key={camp.id} campaign={camp} />
            ))}
          </div>
        )}
      </div>

      <AICampaignBuilderModal 
        isOpen={builderOpen} 
        onClose={() => setBuilderOpen(false)} 
        onSuccess={handleCampaignSuccess}
        initialPreset={builderPreset}
      />
    </div>
  );
}
