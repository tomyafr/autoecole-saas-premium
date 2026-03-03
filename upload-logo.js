const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
    'https://uwuethmbvxomawzyuqfp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dWV0aG1idnhvbWF3enl1cWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDYzMzQsImV4cCI6MjA4ODA4MjMzNH0.-vrm9cBwJSgRSEdLp-I3GKBGzjjaA4JrbY7OtdldPH0'
);

async function uploadLogo() {
    const filePath = path.join(__dirname, 'public', 'logo-autodrive-removebg-preview.png');

    if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        const { error } = await supabase.storage
            .from('assets')
            .upload('logo.png', buffer, {
                contentType: 'image/png',
                upsert: true
            });

        if (error) {
            console.error('Error uploading logo:', error.message);
        } else {
            console.log('✅ Logo (PNG) uploadé avec succès sur Supabase Storage !');
            const { data } = supabase.storage.from('assets').getPublicUrl('logo.png');
            console.log('URL Publique :', data.publicUrl);
        }
    } else {
        console.error('❌ Fichier introuvable :', filePath);
    }
}

uploadLogo();
