// WhatsApp Group Phone Number Extractor
// Run this in browser console while viewing a WhatsApp Web group chat

(async function extractGroupPhoneNumbers() {
    try {
        // Method 1: Try to get phone numbers from group info
        const groupInfoButton = document.querySelector('[data-tab="6"]') || 
                               document.querySelector('[aria-label*="Group info"]') ||
                               document.querySelector('header [role="button"]:last-child');
        
        if (groupInfoButton) {
            groupInfoButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Wait for group info to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Look for participant elements in group info
        const participantSelectors = [
            '[data-testid="participant-item"]',
            '[data-testid="contact-info-drawer"] [role="listitem"]',
            '.copyable-text[data-testid*="phone"]',
            '[title*="+"]',
            'span[title*="+"]'
        ];
        
        let phoneNumbers = new Set();
        
        // Try different methods to extract phone numbers
        participantSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const text = el.textContent || el.title || '';
                const phoneMatch = text.match(/\+\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,9}/g);
                if (phoneMatch) {
                    phoneMatch.forEach(phone => {
                        const cleanPhone = phone.replace(/[\s\-]/g, '');
                        phoneNumbers.add(cleanPhone);
                    });
                }
            });
        });
        
        // Method 2: Check for phone numbers in any visible text
        const allText = document.body.innerText;
        const phoneRegex = /\+\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,9}/g;
        const foundPhones = allText.match(phoneRegex);
        
        if (foundPhones) {
            foundPhones.forEach(phone => {
                const cleanPhone = phone.replace(/[\s\-]/g, '');
                phoneNumbers.add(cleanPhone);
            });
        }
        
        // Method 3: Look for copyable text elements that might contain phones
        const copyableElements = document.querySelectorAll('.copyable-text, [data-testid*="copyable"]');
        copyableElements.forEach(el => {
            const text = el.textContent || el.title || '';
            if (text.includes('+')) {
                const phoneMatch = text.match(/\+\d+/);
                if (phoneMatch) {
                    phoneNumbers.add(phoneMatch[0]);
                }
            }
        });
        
        const phoneArray = Array.from(phoneNumbers).filter(phone => 
            phone.length >= 10 && phone.startsWith('+')
        );
        
        if (phoneArray.length > 0) {
            console.log('📱 Found phone numbers:');
            phoneArray.forEach((phone, index) => {
                console.log(`${index + 1}. ${phone}`);
            });
            
            // Copy to clipboard
            const phoneList = phoneArray.join('\n');
            navigator.clipboard.writeText(phoneList).then(() => {
                console.log('✅ Phone numbers copied to clipboard!');
                alert(`Found ${phoneArray.length} phone numbers and copied to clipboard!`);
            }).catch(() => {
                console.log('❌ Could not copy to clipboard automatically.');
                console.log('📋 Copy this text manually:');
                console.log(phoneList);
            });
            
            return phoneArray;
        } else {
            console.log('❌ No phone numbers found. Make sure you are in a group chat and try:');
            console.log('1. Open group info first');
            console.log('2. Scroll through the participants list');
            console.log('3. Run the script again');
        }
        
    } catch (error) {
        console.error('Error extracting phone numbers:', error);
        console.log('💡 Try these steps:');
        console.log('1. Make sure you are in a WhatsApp Web group chat');
        console.log('2. Open the group info panel');
        console.log('3. Scroll through participants if there are many');
        console.log('4. Run the script again');
    }
})();

// Alternative method if the above doesn't work:
// You can also try running this simpler version:
/*
console.log('🔍 Searching for phone numbers in current view...');
const phoneRegex = /\+\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,9}/g;
const allText = document.body.innerText;
const phones = [...new Set(allText.match(phoneRegex) || [])];
console.log('Found phones:', phones);
if (phones.length > 0) {
    navigator.clipboard.writeText(phones.join('\n'));
    console.log('✅ Copied to clipboard!');
}
*/
