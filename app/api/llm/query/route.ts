import { NextRequest, NextResponse } from 'next/server';

const LLM_GATEWAY_URL = process.env.LLM_GATEWAY_URL || 'http://172.17.184.236:8000';

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
    
    console.log('API Route: Forwarding to LLM Gateway:', LLM_GATEWAY_URL);
    
    const response = await fetch(`${LLM_GATEWAY_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('LLM Gateway error:', response.status, response.statusText);
      // Mode dégradé : réponse automatique
      return NextResponse.json({
        response: `Merci pour votre question "${body.question}". Le service MAISYS est temporairement en maintenance. Voici quelques informations générales qui pourraient vous aider : Pour consulter vos comptes, connectez-vous à votre espace client. Pour un virement, utilisez notre plateforme sécurisée. Pour toute urgence, contactez le 05 62 XX XX XX. Nous sommes désolés pour la gêne occasionnée.`,
        agent: 'maisys-fallback',
        confidence: 0.9
      });
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding to LLM Gateway:', error);
    // Mode dégradé en cas d'erreur réseau
    return NextResponse.json({
      response: `Je comprends votre demande concernant "${body.question || 'vos services bancaires'}". Notre système intelligent est temporairement indisponible, mais voici ce que je peux vous dire : La Regionale Bank propose une gamme complète de services bancaires (comptes, virements, crédits, assurances). Notre équipe de conseillers est disponible du lundi au vendredi de 8h à 18h. Pour une assistance immédiate, appelez le 05 62 XX XX XX.`,
      agent: 'maisys-emergency',
      confidence: 0.8
    });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'LLM Gateway API Proxy',
    target: LLM_GATEWAY_URL 
  });
}
