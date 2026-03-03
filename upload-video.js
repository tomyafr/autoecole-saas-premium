const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
    'https://uwuethmbvxomawzyuqfp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dWV0aG1idnhvbWF3enl1cWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDYzMzQsImV4cCI6MjA4ODA4MjMzNH0.-vrm9cBwJSgRSEdLp-I3GKBGzjjaA4JrbY7OtdldPH0'
);

async function uploadVideo() {
    const filePath = path.join(__dirname, 'public', 'animation_voiture.mp4');

    if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        console.log('Uploading video...');
        const { error } = await supabase.storage
            .from('assets')
            .upload('animation_voiture.mp4', buffer, {
                contentType: 'video/mp4',
                upsert: true
            });

        if (error) {
            console.error('Error uploading video:', error.message);
        } else {
            console.log('✅ Vidéo uploadée avec succès sur Supabase Storage !');
            const { data } = supabase.storage.from('assets').getPublicUrl('animation_voiture.mp4');
            console.log('URL Publique :', data.publicUrl);
        }
    } else {
        console.error('❌ Fichier introuvable :', filePath);
    }
}

uploadVideo();
