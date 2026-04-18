import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { Owner, CATEGORIES } from '../../types/owner';
import { api } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Wand2 } from 'lucide-react';

const DEMO_DATA = {
  name: 'Rajesh Kumar',
  businessName: 'Kumar Electronics & Repairs',
  category: 'ELECTRICIAN',
  description: 'Premier electronics repair and installation service in Bangalore with over 15 years of experience. Specialising in home appliances, commercial wiring, and solar panel installations. Certified and insured professionals available 24/7 for emergency calls.',
  email: 'rajesh@kumarelectronics.in',
  phone: '9845012345',
  address: '12 Brigade Road, Ashok Nagar',
  city: 'Bangalore',
  state: 'Karnataka',
  zipCode: '560025',
  image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  website: 'https://kumarelectronics.in',
  rating: 4.7,
  reviewCount: 128,
};

const INDIAN_STATES_AND_CITIES: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kakinada', 'Rajahmundry', 'Anantapur', 'Kurnool', 'Eluru'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Along', 'Tezu', 'Roing', 'Daporijo'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'North Lakhimpur'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Arrah', 'Begusarai', 'Katihar', 'Munger'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Dhamtari'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Cuncolim', 'Sanquelim', 'Canacona'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat', 'Panchkula', 'Yamunanagar'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Bilaspur', 'Hamirpur', 'Una', 'Palampur'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh', 'Phusro', 'Dumka'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Gulbarga', 'Davangere', 'Bellary', 'Shimoga', 'Tumkur'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam', 'Malappuram'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Navi Mumbai'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Senapati', 'Ukhrul', 'Tamenglong', 'Chandel', 'Jiribam'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara', 'Resubelpara', 'Nongpoh', 'Mairang', 'Khliehriat'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Saiha', 'Lawngtlai', 'Mamit', 'Saitual', 'Hnahthial'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Mon', 'Phek', 'Kiphire', 'Longleng'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Baripada', 'Bhadrak', 'Jharsuguda'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bhilwara', 'Sikar', 'Sri Ganganagar'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo', 'Singtam', 'Jorethang', 'Ravangla', 'Pakyong', 'Soreng'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Thoothukudi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Siddipet'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailasahar', 'Ambassa', 'Belonia', 'Khowai', 'Sabroom', 'Sonamura', 'Amarpur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut', 'Noida', 'Ghaziabad', 'Bareilly', 'Aligarh'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Roorkee', 'Kashipur', 'Rudrapur', 'Nainital', 'Mussoorie', 'Pithoragarh'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur'],
  'Delhi': ['New Delhi', 'Delhi'],
  'Chandigarh': ['Chandigarh'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua', 'Udhampur', 'Rajouri', 'Poonch', 'Kupwara'],
  'Ladakh': ['Leh', 'Kargil'],
};

const STATES = Object.keys(INDIAN_STATES_AND_CITIES).sort();

interface OwnerFormProps {
  initialData?: Owner;
  onSubmit: (data: Omit<Owner, 'id' | 'createdAt'>) => void;
}

interface FormData {
  name: string;
  businessName: string;
  category: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image: string;
  website: string;
  rating: number;
  reviewCount: number;
}

export function OwnerForm({ initialData, onSubmit }: OwnerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: initialData ? {
      name: initialData.name,
      businessName: initialData.businessName,
      category: initialData.category,
      description: initialData.description,
      email: initialData.email,
      phone: initialData.phone,
      address: initialData.address,
      city: initialData.city,
      state: initialData.state,
      zipCode: initialData.zipCode,
      image: initialData.image,
      website: initialData.website || '',
      rating: initialData.rating,
      reviewCount: initialData.reviewCount,
    } : {
      name: '',
      businessName: '',
      category: CATEGORIES[0],
      description: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzAyMjI5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      website: '',
      rating: 4.5,
      reviewCount: 0,
    },
  });

  const category = watch('category');
  const selectedState = watch('state');
  const imageUrl = watch('image');

  const [cities, setCities] = useState<string[]>([]);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      const url = await api.uploadImage(file);
      setValue('image', url, { shouldValidate: true });
    } catch {
      setUploadError('Upload failed. Try again or use a URL instead.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (selectedState && INDIAN_STATES_AND_CITIES[selectedState]) {
      setCities(INDIAN_STATES_AND_CITIES[selectedState]);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    color: "var(--primary)",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid var(--border)",
    fontFamily: "var(--font-sans)",
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 style={sectionHeadingStyle}>Personal Information</h3>

        <div>
          <Label htmlFor="name">Owner Name *</Label>
          <Input
            id="name"
            {...register('name', {
              required: 'Owner name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Phone number must be exactly 10 digits'
              }
            })}
            placeholder="9876543210"
            maxLength={10}
          />
          {errors.phone && (
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Business Information */}
      <div className="space-y-4">
        <h3 style={sectionHeadingStyle}>Business Information</h3>

        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            {...register('businessName', {
              required: 'Business name is required',
              minLength: { value: 2, message: 'Business name must be at least 2 characters' }
            })}
            placeholder="ABC Company"
          />
          {errors.businessName && (
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.businessName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={category}
            onValueChange={(value) => setValue('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 20, message: 'Description must be at least 20 characters' }
            })}
            placeholder="Describe the business..."
            rows={4}
          />
          {errors.description && (
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            {...register('website', {
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Website must start with http:// or https://'
              }
            })}
            placeholder="https://example.com"
          />
          {errors.website && (
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.website.message}</p>
          )}
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 style={sectionHeadingStyle}>Address Information</h3>

        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            {...register('address', { required: 'Address is required' })}
            placeholder="45 MG Road, Andheri West"
          />
          {errors.address && (
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state">State *</Label>
            <Select
              value={selectedState}
              onValueChange={(value) => {
                setValue('state', value, { shouldValidate: true });
                setValue('city', '', { shouldValidate: false });
              }}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('state', { required: 'State is required' })} />
            {errors.state && (
              <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.state.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <Select
              value={watch('city')}
              onValueChange={(value) => setValue('city', value, { shouldValidate: true })}
              disabled={!selectedState}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('city', { required: 'City is required' })} />
            {errors.city && (
              <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.city.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="zipCode">PIN Code *</Label>
          <Input
            id="zipCode"
            {...register('zipCode', {
              required: 'PIN code is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'PIN code must be exactly 6 digits'
              }
            })}
            placeholder="400001"
            maxLength={6}
          />
          {errors.zipCode && (
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.zipCode.message}</p>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 style={sectionHeadingStyle}>Additional Information</h3>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="image">Image *</Label>
            <div className="flex" style={{ border: "1px solid var(--border)" }}>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className="px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={{
                  backgroundColor: uploadMode === 'url' ? 'var(--primary)' : 'transparent',
                  color: uploadMode === 'url' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  borderRight: '1px solid var(--border)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className="px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={{
                  backgroundColor: uploadMode === 'file' ? 'var(--primary)' : 'transparent',
                  color: uploadMode === 'file' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Upload
              </button>
            </div>
          </div>

          <input
            type="hidden"
            {...register('image', { required: 'Image is required' })}
          />

          {uploadMode === 'url' ? (
            <Input
              id="image"
              value={imageUrl || ''}
              onChange={(e) => setValue('image', e.target.value, { shouldValidate: true })}
              placeholder="https://example.com/image.jpg"
            />
          ) : (
            <div
              className="p-6 text-center cursor-pointer transition-colors" style={{ border: '2px dashed var(--border)', backgroundColor: 'var(--secondary)' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              {uploading ? (
                <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>Uploading...</p>
              ) : imageUrl && uploadMode === 'file' && imageUrl.startsWith('/uploads') ? (
                <div className="space-y-2">
                  <img src={imageUrl} alt="Preview" className="h-24 mx-auto object-cover" />
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>Uploaded</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Click to replace</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Click or drag & drop</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>PNG, JPG, GIF — max 5MB</p>
                </div>
              )}
            </div>
          )}

          {uploadError && <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{uploadError}</p>}
          {errors.image && <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.image.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rating">Rating *</Label>
            <StepperInput
              id="rating"
              value={watch('rating')}
              step={0.1}
              min={0}
              max={5}
              decimals={1}
              onChange={(v) => setValue('rating', v, { shouldValidate: true })}
            />
            <input type="hidden" {...register('rating', {
              required: 'Rating is required',
              min: { value: 0, message: 'Rating must be at least 0' },
              max: { value: 5, message: 'Rating cannot exceed 5' },
              valueAsNumber: true
            })} />
            {errors.rating && (
              <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.rating.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reviewCount">Review Count *</Label>
            <StepperInput
              id="reviewCount"
              value={watch('reviewCount')}
              step={1}
              min={0}
              decimals={0}
              onChange={(v) => setValue('reviewCount', v, { shouldValidate: true })}
            />
            <input type="hidden" {...register('reviewCount', {
              required: 'Review count is required',
              min: { value: 0, message: 'Review count must be at least 0' },
              valueAsNumber: true
            })} />
            {errors.reviewCount && (
              <p className="text-xs mt-1 font-medium" style={{ color: "var(--destructive)" }}>{errors.reviewCount.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-6 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>

        {!initialData && (
          <button
            type="button"
            onClick={() => {
              Object.entries(DEMO_DATA).forEach(([key, value]) => {
                setValue(key as keyof FormData, value as never, { shouldValidate: true });
              });
            }}
            className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
            style={{
              backgroundColor: "var(--secondary)",
              color: "var(--muted-foreground)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
              (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
            }}
          >
            <Wand2 className="h-3.5 w-3.5" />
            Fill Demo Data
          </button>
        )}

        <button
          type="submit"
          className="w-full py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-85"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {initialData ? 'Update Owner' : 'Create Owner'}
        </button>
      </div>
    </form>
  );
}

function StepperInput({
  id,
  value,
  step,
  min,
  max,
  decimals,
  onChange,
}: {
  id: string;
  value: number;
  step: number;
  min: number;
  max?: number;
  decimals: number;
  onChange: (v: number) => void;
}) {
  const dec = (v: number) => {
    const next = Math.max(min, parseFloat((v - step).toFixed(decimals)));
    onChange(next);
  };
  const inc = (v: number) => {
    const next = max !== undefined
      ? Math.min(max, parseFloat((v + step).toFixed(decimals)))
      : parseFloat((v + step).toFixed(decimals));
    onChange(next);
  };

  const btnStyle: React.CSSProperties = {
    width: "2.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--secondary)",
    color: "var(--muted-foreground)",
    border: "none",
    borderLeft: "1px solid var(--border)",
    cursor: "pointer",
    fontSize: "1rem",
    lineHeight: 1,
    transition: "background-color 0.12s, color 0.12s",
    fontFamily: "var(--font-sans)",
    flexShrink: 0,
    flexDirection: "column",
    gap: 0,
  };

  return (
    <div
      id={id}
      className="flex"
      style={{ border: "1px solid var(--border)", backgroundColor: "var(--card)" }}
    >
      <input
        type="text"
        readOnly
        value={typeof value === 'number' && !isNaN(value) ? value.toFixed(decimals) : ''}
        className="flex-1 px-3 py-2 text-sm font-medium bg-transparent outline-none"
        style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)", minWidth: 0 }}
      />
      <div style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid var(--border)" }}>
        <button
          type="button"
          onClick={() => inc(value)}
          disabled={max !== undefined && value >= max}
          style={{
            ...btnStyle,
            borderLeft: "none",
            borderBottom: "1px solid var(--border)",
            height: "50%",
            minHeight: "1.25rem",
            flexDirection: "row",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--primary)";
            (e.currentTarget as HTMLElement).style.color = "var(--primary-foreground)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)";
            (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
          }}
        >
          <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor">
            <path d="M4 0L8 5H0L4 0Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => dec(value)}
          disabled={value <= min}
          style={{
            ...btnStyle,
            borderLeft: "none",
            height: "50%",
            minHeight: "1.25rem",
            flexDirection: "row",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--primary)";
            (e.currentTarget as HTMLElement).style.color = "var(--primary-foreground)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)";
            (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
          }}
        >
          <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor">
            <path d="M4 5L0 0H8L4 5Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
