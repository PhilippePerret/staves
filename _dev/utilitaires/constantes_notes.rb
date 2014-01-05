t = ""
8.times do |octave|
  
  ['a','b', 'c', 'd', 'e', 'f', 'g'].each do |let|
    
    ['', 'd', 'b'].each do |alt|
    
      note = "#{let}#{alt}#{octave}"
      t << "const #{note}='#{note}'; "
      
    end
  end
end

puts t