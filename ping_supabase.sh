#!/bin/bash
# Ping Supabase API to keep project alive
curl -s -X GET "https://htenehyaznqyhibqoqlc.supabase.co/rest/v1/site_settings?select=singleton" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW5laHlhem5xeWhpYnFvcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMDUyMTgsImV4cCI6MjEwNjY4MTIxOH0.DtqS5OI0Bhbza7CCbXMnsCZU2wjxPrPprJAfDlLr10s" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW5laHlhem5xeWhpYnFvcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMDUyMTgsImV4cCI6MjEwNjY4MTIxOH0.DtqS5OI0Bhbza7CCbXMnsCZU2wjxPrPprJAfDlLr10s"
echo -e "\nSupabase Keep-Alive Ping Sent!"
