require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/night-cyc-prototype/dist'

get '/' do
  send_file File.dirname(__FILE__) + '/night-cyc-prototype/dist/index.html'
end

post '/donation' do
  send_file File.dirname(__FILE__) + '/night-cyc-prototype/dist/thanks.html'
end
